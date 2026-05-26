import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getTrending } from '../services/api'
import type { Stock } from '../types'

export default function CompareStocksPage() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [selected, setSelected] = useState(['AAPL', 'NVDA', 'MSFT'])

  useEffect(() => {
    getTrending().then((data) => setStocks(data.stocks))
  }, [])

  const selectedStocks = stocks.filter((stock) => selected.includes(stock.ticker))
  const comparison = selectedStocks.map((stock) => ({
    ticker: stock.ticker,
    growth: stock.changePercent,
    marketCap: Number.parseFloat(stock.marketCap) * (stock.marketCap.endsWith('T') ? 1000 : 1),
    volume: stock.history.at(-1)?.volume || 0,
  }))
  const overlay = selectedStocks[0]?.history.map((point, index) => ({
    label: point.label,
    ...Object.fromEntries(selectedStocks.map((stock) => [stock.ticker, stock.history[index]?.price || null])),
  }))

  return (
    <div className="page-stack">
      <section className="section-header">
        <div>
          <span className="eyebrow">Compare stocks</span>
          <h1>Overlay performance lab</h1>
        </div>
      </section>

      <section className="ticker-picker glass-panel">
        {stocks.map((stock) => (
          <button
            className={selected.includes(stock.ticker) ? 'active' : ''}
            key={stock.ticker}
            type="button"
            onClick={() =>
              setSelected((current) =>
                current.includes(stock.ticker)
                  ? current.filter((ticker) => ticker !== stock.ticker)
                  : [...current, stock.ticker]
              )
            }
          >
            {stock.ticker}
          </button>
        ))}
      </section>

      <section className="glass-panel chart-panel">
        <h2>Price comparison</h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={overlay || []}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="label" tick={{ fill: '#6B7280' }} />
            <YAxis tick={{ fill: '#6B7280' }} />
            <Tooltip contentStyle={{ background: '#090909', border: '1px solid rgba(139,92,246,0.35)' }} />
            {selectedStocks.map((stock, index) => (
              <Line
                key={stock.ticker}
                dataKey={stock.ticker}
                stroke={['#8B5CF6', '#38BDF8', '#22C55E', '#60A5FA'][index % 4]}
                strokeWidth={3}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className="dual-grid">
        <article className="glass-panel chart-panel">
          <h2>Growth %</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparison}>
              <XAxis dataKey="ticker" tick={{ fill: '#B3B3B3' }} />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip />
              <Bar dataKey="growth" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
        <article className="glass-panel chart-panel">
          <h2>Market cap scale</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparison}>
              <XAxis dataKey="ticker" tick={{ fill: '#B3B3B3' }} />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip />
              <Bar dataKey="marketCap" fill="#38BDF8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </section>
    </div>
  )
}
