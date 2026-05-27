import { Reorder, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
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
    sector: stock.sector,
    volatility:
      stock.history.reduce((total, point, index, history) => {
        if (index === 0) return total
        return total + Math.abs(((point.price - history[index - 1].price) / history[index - 1].price) * 100)
      }, 0) / Math.max(stock.history.length - 1, 1),
  }))
  const sectorAllocation = Object.values(
    selectedStocks.reduce<Record<string, { name: string; value: number }>>((groups, stock) => {
      groups[stock.sector] = groups[stock.sector] || { name: stock.sector, value: 0 }
      groups[stock.sector].value += 1
      return groups
    }, {})
  )
  const heatmap = selectedStocks.flatMap((rowStock) =>
    selectedStocks.map((columnStock) => ({
      key: `${rowStock.ticker}-${columnStock.ticker}`,
      row: rowStock.ticker,
      column: columnStock.ticker,
      value:
        rowStock.ticker === columnStock.ticker
          ? 1
          : 1 - Math.min(0.8, Math.abs(rowStock.changePercent - columnStock.changePercent) / 10),
    }))
  )
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
        <div className="chart-toolbar">
          <h2>Price comparison</h2>
          <div className="interactive-legend">
            {selectedStocks.map((stock, index) => (
              <span key={stock.ticker}>
                <i style={{ background: ['#8B5CF6', '#38BDF8', '#22C55E', '#A855F7'][index % 4] }} />
                {stock.ticker}
              </span>
            ))}
          </div>
        </div>
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

      <section className="compare-command-grid">
        <article className="glass-panel list-panel">
          <h2>Drag order</h2>
          <Reorder.Group axis="y" values={selected} onReorder={setSelected} className="reorder-list">
            {selected.map((ticker) => (
              <Reorder.Item value={ticker} key={ticker}>
                <span>{ticker}</span>
                <strong>{stocks.find((stock) => stock.ticker === ticker)?.companyName}</strong>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </article>
        <article className="glass-panel list-panel ai-panel">
          <span className="eyebrow">AI insights</span>
          <h2>Pair trade read</h2>
          <p>
            {comparison[0]?.ticker || 'AAPL'} shows the strongest near-term tape, while volatility clusters around{' '}
            {[...comparison].sort((a, b) => b.volatility - a.volatility)[0]?.ticker || 'NVDA'}.
          </p>
        </article>
        <article className="glass-panel chart-panel">
          <h2>Sector allocation</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sectorAllocation} dataKey="value" nameKey="name" innerRadius={44} outerRadius={78}>
                {sectorAllocation.map((entry, index) => (
                  <Cell key={entry.name} fill={['#8B5CF6', '#38BDF8', '#22C55E', '#A855F7'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </article>
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

      <section className="dual-grid">
        <article className="glass-panel chart-panel">
          <h2>Correlation heatmap</h2>
          <div className="heatmap-grid" style={{ '--cols': selectedStocks.length } as CSSProperties}>
            {heatmap.map((cell) => (
              <span key={cell.key} style={{ opacity: 0.25 + cell.value * 0.75 }}>
                {cell.row === cell.column ? cell.row : ''}
              </span>
            ))}
          </div>
        </article>
        <article className="glass-panel list-panel">
          <h2>Performance leaderboard</h2>
          {[...comparison]
            .sort((a, b) => b.growth - a.growth)
            .map((stock, index) => (
              <motion.div className="list-row" key={stock.ticker} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <span>#{index + 1}</span>
                <strong>{stock.ticker}</strong>
                <em className={stock.growth >= 0 ? 'profit' : 'loss'}>{stock.growth}%</em>
              </motion.div>
            ))}
        </article>
      </section>
    </div>
  )
}
