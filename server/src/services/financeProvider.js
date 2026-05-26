const { stocks, createHistory } = require('../data/marketData')

async function fetchYahooQuote(ticker) {
  if (process.env.USE_LIVE_FINANCE !== 'true') return null

  const response = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=1mo&interval=1d`
  )

  if (!response.ok) return null

  const data = await response.json()
  const result = data.chart?.result?.[0]
  const quote = result?.indicators?.quote?.[0]
  const closes = quote?.close || []
  const timestamps = result?.timestamp || []

  if (!result || closes.length === 0) return null

  const meta = result.meta || {}
  const fallback = stocks.find((stock) => stock.ticker === ticker)
  const history = closes.map((price, index) => {
    const close = Number(price || closes[index - 1] || meta.regularMarketPrice || fallback?.price || 100)
    const open = Number(quote.open?.[index] || close)
    const high = Number(quote.high?.[index] || close)
    const low = Number(quote.low?.[index] || close)
    const volume = Number(quote.volume?.[index] || 0)

    return {
      label: new Date((timestamps[index] || Date.now() / 1000) * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      price: Number(close.toFixed(2)),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      volume,
      ma50: Number((close * 0.985).toFixed(2)),
      ma200: Number((close * 0.94).toFixed(2)),
      rsi: 55,
      macd: Number(((close - open) / 2).toFixed(2)),
      upperBand: Number((close * 1.035).toFixed(2)),
      lowerBand: Number((close * 0.965).toFixed(2)),
    }
  })

  return {
    ticker,
    companyName: fallback?.companyName || ticker,
    sector: fallback?.sector || 'Market',
    price: Number((meta.regularMarketPrice || history.at(-1)?.price || fallback?.price || 0).toFixed(2)),
    changePercent: Number((meta.regularMarketChangePercent || fallback?.changePercent || 0).toFixed(2)),
    marketCap: fallback?.marketCap || 'N/A',
    logo: fallback?.logo || ticker[0],
    description: fallback?.description || `${ticker} live quote from Yahoo Finance.`,
    history,
  }
}

async function getFinanceStock(ticker) {
  try {
    return (await fetchYahooQuote(ticker)) || null
  } catch {
    return null
  }
}

async function getFinanceHistory(ticker, range) {
  const liveStock = await getFinanceStock(ticker)
  return liveStock?.history || createHistory(ticker, range)
}

module.exports = { getFinanceStock, getFinanceHistory }
