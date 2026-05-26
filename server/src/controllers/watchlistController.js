const WatchlistItem = require('../models/WatchlistItem')
const { stocks, enrichStock } = require('../data/marketData')

async function getWatchlist(req, res) {
  const items = await WatchlistItem.find({ user: req.user.id }).sort({ pinned: -1, createdAt: -1 })
  const enrichedItems = items.map((item) => {
    const stock = stocks.find((candidate) => candidate.ticker === item.ticker)
    return {
      id: item._id,
      ticker: item.ticker,
      companyName: item.companyName,
      pinned: item.pinned,
      stock: stock ? enrichStock(stock) : null,
    }
  })

  return res.json({ items: enrichedItems })
}

async function addWatchlistItem(req, res) {
  const ticker = String(req.body.ticker || '').trim().toUpperCase()
  const stock = stocks.find((candidate) => candidate.ticker === ticker)

  if (!stock) {
    return res.status(404).json({ message: 'Stock not found' })
  }

  const item = await WatchlistItem.findOneAndUpdate(
    { user: req.user.id, ticker },
    {
      user: req.user.id,
      ticker,
      companyName: stock.companyName,
      pinned: Boolean(req.body.pinned),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )

  return res.status(201).json({ item })
}

async function removeWatchlistItem(req, res) {
  const ticker = String(req.params.ticker || req.body.ticker || '').trim().toUpperCase()
  await WatchlistItem.deleteOne({ user: req.user.id, ticker })
  return res.json({ ok: true })
}

async function togglePinned(req, res) {
  const ticker = String(req.params.ticker || '').trim().toUpperCase()
  const item = await WatchlistItem.findOne({ user: req.user.id, ticker })

  if (!item) {
    return res.status(404).json({ message: 'Watchlist item not found' })
  }

  item.pinned = !item.pinned
  await item.save()

  return res.json({ item })
}

module.exports = { getWatchlist, addWatchlistItem, removeWatchlistItem, togglePinned }
