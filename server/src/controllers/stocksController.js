const User = require('../models/User')
const { stocks, marketIndexes, createHistory, enrichStock } = require('../data/marketData')
const { getFinanceStock, getFinanceHistory } = require('../services/financeProvider')

async function rememberSearch(userId, ticker) {
  if (!userId || !ticker) return
  await User.findByIdAndUpdate(userId, {
    $pull: { recentSearches: ticker },
  })
  await User.findByIdAndUpdate(userId, {
    $push: { recentSearches: { $each: [ticker], $position: 0, $slice: 8 } },
  })
}

async function rememberViewed(userId, ticker) {
  if (!userId || !ticker) return
  await User.findByIdAndUpdate(userId, {
    $pull: { recentlyViewed: ticker },
  })
  await User.findByIdAndUpdate(userId, {
    $push: { recentlyViewed: { $each: [ticker], $position: 0, $slice: 8 } },
  })
}

async function searchStocks(req, res) {
  const query = String(req.query.q || '').trim().toLowerCase()
  const results = stocks
    .filter((stock) => {
      if (!query) return true
      return (
        stock.ticker.toLowerCase().includes(query) ||
        stock.companyName.toLowerCase().includes(query)
      )
    })
    .slice(0, 8)
    .map(enrichStock)

  if (req.user?.id && results[0]) {
    await rememberSearch(req.user.id, results[0].ticker)
  }

  return res.json({ results })
}

async function getStock(req, res) {
  const ticker = req.params.ticker.toUpperCase()
  const stock = stocks.find((item) => item.ticker === ticker)

  if (!stock) {
    const liveStock = await getFinanceStock(ticker)
    if (!liveStock) {
      return res.status(404).json({ message: 'Stock not found' })
    }
    return res.json({ stock: liveStock })
  }

  if (req.user?.id) {
    await rememberViewed(req.user.id, ticker)
  }

  return res.json({ stock: (await getFinanceStock(ticker)) || enrichStock(stock) })
}

async function getHistory(req, res) {
  const ticker = req.params.ticker.toUpperCase()
  const range = req.query.range || '1M'
  const stock = stocks.find((item) => item.ticker === ticker)

  if (!stock) {
    const history = await getFinanceHistory(ticker, range)
    return res.json({ ticker, range, history })
  }

  return res.json({ ticker, range, history: await getFinanceHistory(ticker, range) })
}

function getTrending(req, res) {
  return res.json({
    indexes: marketIndexes,
    stocks: stocks.map(enrichStock).sort((a, b) => b.changePercent - a.changePercent),
  })
}

function getAnalytics(req, res) {
  const sectorColors = ['#8B5CF6', '#60A5FA', '#38BDF8', '#22C55E', '#A855F7', '#EF4444']
  const sectorCounts = stocks.reduce((accumulator, stock) => {
    accumulator[stock.sector] = (accumulator[stock.sector] || 0) + 1
    return accumulator
  }, {})
  const totalStocks = stocks.length || 1

  return res.json({
    topGainers: stocks.filter((stock) => stock.changePercent > 0).map(enrichStock),
    topLosers: stocks.filter((stock) => stock.changePercent < 0).map(enrichStock),
    sectorPerformance: Object.entries(sectorCounts).map(([name, count], index) => ({
      name,
      value: Math.round((count / totalStocks) * 100),
      fill: sectorColors[index % sectorColors.length],
    })),
    sentiment: [
      {
        label: 'Bullish',
        value: stocks.filter((stock) => stock.changePercent > 0.5).length,
      },
      {
        label: 'Neutral',
        value: stocks.filter((stock) => stock.changePercent >= -0.5 && stock.changePercent <= 0.5).length,
      },
      {
        label: 'Bearish',
        value: stocks.filter((stock) => stock.changePercent < -0.5).length,
      },
    ],
  })
}

module.exports = { searchStocks, getStock, getHistory, getTrending, getAnalytics }
