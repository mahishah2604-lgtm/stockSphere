import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiBell, FiTrash2 } from 'react-icons/fi'
import StockChart from '../components/StockChart'
import { getWatchlist, pinWatchlistItem, removeFromWatchlist } from '../services/api'
import type { WatchlistItem } from '../types'

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([])

  async function refresh() {
    setItems(await getWatchlist())
  }

  useEffect(() => {
    let active = true
    getWatchlist().then((nextItems) => {
      if (active) setItems(nextItems)
    })
    return () => {
      active = false
    }
  }, [])
  const positive = items.filter((item) => (item.stock?.changePercent || 0) >= 0).length
  const allocation = items.map((item) => ({
    ticker: item.ticker,
    value: Math.round(100 / Math.max(items.length, 1)),
  }))

  return (
    <div className="page-stack">
      <section className="section-header">
        <div>
          <span className="eyebrow">Saved stocks</span>
          <h1>Watchlist</h1>
        </div>
      </section>
      {items.length > 0 && (
        <section className="dashboard-insight-grid">
          <article className="glass-panel breadth-card">
            <span className="eyebrow">Watchlist performance</span>
            <strong>{Math.round((positive / items.length) * 100)}%</strong>
            <p>of saved symbols are positive</p>
            <div className="breadth-bar">
              <span style={{ width: `${Math.round((positive / items.length) * 100)}%` }} />
            </div>
          </article>
          <article className="glass-panel list-panel">
            <h2>Allocation</h2>
            {allocation.slice(0, 4).map((item) => (
              <div className="allocation-row" key={item.ticker}>
                <span>{item.ticker}</span>
                <strong style={{ width: `${item.value}%` }} />
                <em>{item.value}%</em>
              </div>
            ))}
          </article>
          <article className="glass-panel list-panel ai-panel">
            <span className="eyebrow">Price alerts</span>
            <h2>Alert engine ready</h2>
            <p>Tap the bell on any card to stage a price alert for your next trading session.</p>
          </article>
        </section>
      )}
      <section className="stock-grid">
        {items.length === 0 && <div className="empty-state glass-panel">Add stocks from the dashboard to build your watchlist.</div>}
        {items.map((item) => (
          <motion.article
            className={`stock-card glass-panel ${item.pinned ? 'pinned' : ''}`}
            key={item.ticker}
            layout
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            whileHover={{ y: -5, scale: 1.01 }}
          >
            <span className="animated-border" />
            <div className="stock-card-top">
              <span className="stock-logo">{item.stock?.logo || item.ticker[0]}</span>
              <div>
                <strong>{item.companyName}</strong>
                <small>{item.ticker}</small>
              </div>
              <em className={item.stock && item.stock.changePercent >= 0 ? 'profit' : 'loss'}>
                {item.stock?.changePercent}%
              </em>
            </div>
            {item.stock && <StockChart data={item.stock.history} compact />}
            <div className="card-actions">
              <button type="button">
                <FiBell />
              </button>
              <button type="button" onClick={() => pinWatchlistItem(item.ticker).then(refresh)}>
                {item.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button type="button" onClick={() => removeFromWatchlist(item.ticker).then(refresh)}>
                <FiTrash2 />
              </button>
            </div>
          </motion.article>
        ))}
      </section>
    </div>
  )
}
