import { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import StockChart from '../components/StockChart'
import Skeleton from '../components/Skeleton'
import { addToWatchlist, getStock, getStockHistory } from '../services/api'
import type { Stock, StockPoint } from '../types'

const ranges = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y']
const modes = ['area', 'line', 'candlestick', 'bar'] as const

export default function StockDetailPage() {
  const { ticker = 'AAPL' } = useParams()
  const [stock, setStock] = useState<Stock | null>(null)
  const [history, setHistory] = useState<StockPoint[]>([])
  const [range, setRange] = useState('1M')
  const [mode, setMode] = useState<(typeof modes)[number]>('area')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([getStock(ticker), getStockHistory(ticker, range)])
      .then(([stockData, historyData]) => {
        if (!active) return
        setStock(stockData)
        setHistory(historyData)
      })
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [range, ticker])

  if (loading || !stock) return <Skeleton height={520} />

  return (
    <div className="page-stack">
      <section className="stock-detail-header glass-panel">
        <span className="stock-logo large">{stock.logo}</span>
        <div>
          <span className="eyebrow">{stock.sector}</span>
          <h1>
            {stock.companyName} <small>{stock.ticker}</small>
          </h1>
          <p>{stock.description}</p>
        </div>
        <button className="button primary" type="button" onClick={() => addToWatchlist(stock.ticker)}>
          <FiPlus />
          Watchlist
        </button>
      </section>

      <section className="glass-panel chart-panel">
        <div className="chart-toolbar">
          <div className="range-tabs">
            {ranges.map((item) => (
              <button className={range === item ? 'active' : ''} key={item} onClick={() => setRange(item)}>
                {item}
              </button>
            ))}
          </div>
          <div className="range-tabs">
            {modes.map((item) => (
              <button className={mode === item ? 'active' : ''} key={item} onClick={() => setMode(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <StockChart data={history} mode={mode} showIndicators />
      </section>

      <section className="metric-grid">
        {[
          ['Market cap', stock.marketCap],
          ['MA50', `$${history.at(-1)?.ma50.toFixed(2)}`],
          ['MA200', `$${history.at(-1)?.ma200.toFixed(2)}`],
          ['RSI', history.at(-1)?.rsi.toFixed(2)],
          ['MACD', history.at(-1)?.macd.toFixed(2)],
          ['Volume', history.at(-1)?.volume.toLocaleString()],
        ].map(([label, value]) => (
          <article className="metric-card glass-panel" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>
    </div>
  )
}
