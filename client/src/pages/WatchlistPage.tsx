import { useEffect, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import StockChart from '../components/StockChart'
import { getWatchlist, pinWatchlistItem, removeFromWatchlist } from '../services/api'
import type { WatchlistItem } from '../types'

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([])

  async function refresh() {
    setItems(await getWatchlist())
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="page-stack">
      <section className="section-header">
        <div>
          <span className="eyebrow">Saved stocks</span>
          <h1>Watchlist</h1>
        </div>
      </section>
      <section className="stock-grid">
        {items.length === 0 && <div className="empty-state glass-panel">Add stocks from the dashboard to build your watchlist.</div>}
        {items.map((item) => (
          <article className="stock-card glass-panel" key={item.ticker}>
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
              <button type="button" onClick={() => pinWatchlistItem(item.ticker).then(refresh)}>
                {item.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button type="button" onClick={() => removeFromWatchlist(item.ticker).then(refresh)}>
                <FiTrash2 />
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
