import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiDownload,
  FiFileText,
  FiMoon,
  FiRadio,
  FiShield,
  FiZap,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import StockChart from '../components/StockChart'
import Skeleton from '../components/Skeleton'
import { useTheme } from '../context/ThemeContext'
import { addToWatchlist, getTrending } from '../services/api'
import type { MarketIndex, Stock } from '../types'

export default function DashboardHome() {
  const [indexes, setIndexes] = useState<MarketIndex[]>([])
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const { toggleTheme } = useTheme()

  useEffect(() => {
    let active = true
    getTrending()
      .then((data) => {
        if (!active) return
        setIndexes(data.indexes)
        setStocks(data.stocks)
      })
      .finally(() => active && setLoading(false))

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="page-stack">
        <Skeleton height={180} />
        <Skeleton height={320} />
      </div>
    )
  }

  const featuredStock = stocks[0]
  const gainers = stocks.filter((stock) => stock.changePercent > 0)
  const breadth = Math.round((gainers.length / Math.max(stocks.length, 1)) * 100)
  const averageMove =
    stocks.reduce((total, stock) => total + Math.abs(stock.changePercent), 0) / Math.max(stocks.length, 1)
  const sectorLeaders = Object.values(
    stocks.reduce<Record<string, { sector: string; count: number; change: number }>>((groups, stock) => {
      const group = groups[stock.sector] || { sector: stock.sector, count: 0, change: 0 }
      group.count += 1
      group.change += stock.changePercent
      groups[stock.sector] = group
      return groups
    }, {})
  )
    .map((sector) => ({ ...sector, change: sector.change / sector.count }))
    .sort((a, b) => b.change - a.change)
    .slice(0, 5)
  const deskBriefs = [
    {
      icon: FiZap,
      title: 'Momentum concentration',
      text: `${gainers.length} of ${stocks.length} tracked instruments are trading higher.`,
    },
    {
      icon: FiShield,
      title: 'Risk tone',
      text: averageMove > 1.4 ? 'Elevated single-name dispersion across the watch universe.' : 'Orderly tape with controlled dispersion.',
    },
    {
      icon: FiRadio,
      title: 'Signal watch',
      text: `${featuredStock?.ticker || 'NVDA'} leads the active board with the strongest relative move.`,
    },
  ]

  return (
    <div className="page-stack">
      <section className="dashboard-hero glass-panel">
        <div>
          <span className="eyebrow">Market overview</span>
          <h1>Night desk is live</h1>
          <p>Monitor indices, trending equities, indicators, news, and portfolio signals in one terminal.</p>
        </div>
        <div className="hero-tools">
          <button className="icon-text-button" type="button">
            <FiFileText />
            AI summary
          </button>
          <button className="icon-text-button" type="button">
            <FiDownload />
            Export PDF
          </button>
          <button className="icon-button" type="button" aria-label="Toggle theme" onClick={toggleTheme}>
            <FiMoon />
          </button>
        </div>
      </section>

      {featuredStock && (
        <section className="dashboard-overview-grid">
          <article className="featured-chart glass-panel">
            <div className="section-header">
              <div>
                <span className="eyebrow">Lead instrument</span>
                <h2>{featuredStock.companyName}</h2>
              </div>
              <Link to={`/dashboard/stocks/${featuredStock.ticker}`}>{featuredStock.ticker}</Link>
            </div>
            <div className="featured-price-row">
              <strong>${featuredStock.price.toLocaleString()}</strong>
              <em className={featuredStock.changePercent >= 0 ? 'profit' : 'loss'}>
                {featuredStock.changePercent >= 0 ? '+' : ''}
                {featuredStock.changePercent}%
              </em>
            </div>
            <StockChart data={featuredStock.history} showIndicators />
          </article>

          <aside className="desk-brief glass-panel">
            <span className="eyebrow">Desk brief</span>
            <h2>Session pulse</h2>
            {deskBriefs.map((brief) => {
              const Icon = brief.icon
              return (
                <div className="brief-row" key={brief.title}>
                  <Icon />
                  <div>
                    <strong>{brief.title}</strong>
                    <p>{brief.text}</p>
                  </div>
                </div>
              )
            })}
          </aside>
        </section>
      )}

      <section className="metric-grid">
        {indexes.map((index, itemIndex) => {
          const positive = index.changePercent >= 0
          const Arrow = positive ? FiArrowUpRight : FiArrowDownRight
          return (
            <motion.article
              className="metric-card glass-panel"
              key={index.ticker}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: itemIndex * 0.06 }}
            >
              <span>{index.name}</span>
              <strong>{index.price.toLocaleString()}</strong>
              <em className={positive ? 'profit' : 'loss'}>
                <Arrow /> {positive ? '+' : ''}
                {index.changePercent}%
              </em>
            </motion.article>
          )
        })}
      </section>

      <section className="dashboard-insight-grid">
        <article className="glass-panel breadth-card">
          <span className="eyebrow">Market breadth</span>
          <strong>{breadth}%</strong>
          <p>of tracked symbols are positive</p>
          <div className="breadth-bar">
            <span style={{ width: `${breadth}%` }} />
          </div>
        </article>
        <article className="glass-panel list-panel">
          <h2>Top gainers</h2>
          {gainers.slice(0, 4).map((stock) => (
            <Link className="list-row" to={`/dashboard/stocks/${stock.ticker}`} key={stock.ticker}>
              <span>{stock.ticker}</span>
              <strong>{stock.companyName}</strong>
              <em className="profit">+{stock.changePercent}%</em>
            </Link>
          ))}
        </article>
        <article className="glass-panel list-panel">
          <h2>Sector pulse</h2>
          {sectorLeaders.map((sector) => (
            <div className="list-row" key={sector.sector}>
              <span>{sector.sector}</span>
              <strong>{sector.count} symbols</strong>
              <em className={sector.change >= 0 ? 'profit' : 'loss'}>
                {sector.change >= 0 ? '+' : ''}
                {sector.change.toFixed(2)}%
              </em>
            </div>
          ))}
        </article>
      </section>

      <section className="section-header">
        <div>
          <span className="eyebrow">Trending stocks</span>
          <h2>Momentum board</h2>
        </div>
        <Link to="/dashboard/compare">Compare stocks</Link>
      </section>

      <section className="stock-grid">
        {stocks.slice(0, 12).map((stock, index) => (
          <motion.article
            className="stock-card glass-panel"
            key={stock.ticker}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5, scale: 1.01 }}
          >
            <Link to={`/dashboard/stocks/${stock.ticker}`} className="stock-card-link">
              <div className="stock-card-top">
                <span className="stock-logo">{stock.logo}</span>
                <div>
                  <strong>{stock.companyName}</strong>
                  <small>{stock.ticker}</small>
                </div>
                <em className={stock.changePercent >= 0 ? 'profit' : 'loss'}>
                  {stock.changePercent >= 0 ? '+' : ''}
                  {stock.changePercent}%
                </em>
              </div>
              <StockChart data={stock.history} compact />
            </Link>
            <button className="mini-action" type="button" onClick={() => addToWatchlist(stock.ticker)}>
              Add to watchlist
            </button>
          </motion.article>
        ))}
      </section>
    </div>
  )
}
