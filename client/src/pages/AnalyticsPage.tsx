import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getAnalytics } from '../services/api'
import type { Stock } from '../types'

export default function AnalyticsPage() {
  const [data, setData] = useState<{
    topGainers: Stock[]
    topLosers: Stock[]
    sectorPerformance: { name: string; value: number; fill: string }[]
    sentiment: { label: string; value: number }[]
  } | null>(null)

  useEffect(() => {
    getAnalytics().then(setData)
  }, [])

  if (!data) return null
  const heatmapStocks = [...data.topGainers, ...data.topLosers].slice(0, 12)
  const totalVolumeScore = heatmapStocks.reduce((total, stock) => total + (stock.history.at(-1)?.volume || 0), 0)

  return (
    <div className="page-stack">
      <section className="section-header">
        <div>
          <span className="eyebrow">Analytics</span>
          <h1>Market intelligence</h1>
        </div>
      </section>
      <section className="dual-grid">
        <article className="glass-panel chart-panel">
          <h2>Sector performance</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.sectorPerformance} dataKey="value" nameKey="name" innerRadius={62} outerRadius={104}>
                {data.sectorPerformance.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </article>
        <article className="glass-panel chart-panel">
          <h2>Market sentiment</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.sentiment}>
              <XAxis dataKey="label" tick={{ fill: '#B3B3B3' }} />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip />
              <Bar dataKey="value" fill="#8B5CF6" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </section>
      <section className="analytics-widget-grid">
        <article className="glass-panel breadth-card">
          <span className="eyebrow">AI market summary</span>
          <strong>{data.topGainers.length > data.topLosers.length ? 'Bullish' : 'Mixed'}</strong>
          <p>
            Leadership is concentrated in {data.topGainers[0]?.sector || 'technology'}, with downside pressure visible in{' '}
            {data.topLosers[0]?.sector || 'cyclicals'}.
          </p>
        </article>
        <article className="glass-panel chart-panel">
          <h2>Market heatmap</h2>
          <div className="market-heatmap">
            {heatmapStocks.map((stock) => (
              <motion.div
                key={stock.ticker}
                className={stock.changePercent >= 0 ? 'gain' : 'drop'}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <strong>{stock.ticker}</strong>
                <span>{stock.changePercent}%</span>
              </motion.div>
            ))}
          </div>
        </article>
        <article className="glass-panel chart-panel">
          <h2>Trading volume map</h2>
          <div className="volume-map">
            {heatmapStocks.slice(0, 8).map((stock) => {
              const volume = stock.history.at(-1)?.volume || 0
              return (
                <div key={stock.ticker}>
                  <span>{stock.ticker}</span>
                  <strong style={{ width: `${Math.max(12, (volume / Math.max(totalVolumeScore, 1)) * 100 * 4)}%` }} />
                </div>
              )
            })}
          </div>
        </article>
      </section>
      <section className="dual-grid">
        <article className="glass-panel list-panel">
          <h2>Top gainers</h2>
          {data.topGainers.map((stock) => (
            <div className="list-row" key={stock.ticker}>
              <span>{stock.ticker}</span>
              <strong>{stock.companyName}</strong>
              <em className="profit">+{stock.changePercent}%</em>
            </div>
          ))}
        </article>
        <article className="glass-panel list-panel">
          <h2>Top losers</h2>
          {data.topLosers.map((stock) => (
            <div className="list-row" key={stock.ticker}>
              <span>{stock.ticker}</span>
              <strong>{stock.companyName}</strong>
              <em className="loss">{stock.changePercent}%</em>
            </div>
          ))}
        </article>
      </section>
    </div>
  )
}
