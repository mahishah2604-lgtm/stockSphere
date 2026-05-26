import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiActivity, FiBarChart2, FiEye, FiLayers, FiTrendingUp } from 'react-icons/fi'
import StockChart from '../components/StockChart'

const mockChart = Array.from({ length: 24 }, (_, index) => ({
  label: `${index}`,
  price: 142 + Math.sin(index / 2) * 7 + index * 1.8,
  open: 140 + index,
  high: 146 + index * 1.6,
  low: 136 + index,
  volume: 1200000 + index * 48000,
  ma50: 139 + index * 1.7,
  ma200: 134 + index * 1.2,
  rsi: 45 + Math.sin(index) * 12,
  macd: Math.cos(index) * 3,
  upperBand: 150 + index * 1.6,
  lowerBand: 130 + index * 1.3,
}))

const features = [
  { icon: FiActivity, title: 'Real-time stock tracking' },
  { icon: FiBarChart2, title: 'Technical indicators' },
  { icon: FiEye, title: 'Watchlists' },
  { icon: FiLayers, title: 'Stock comparison' },
  { icon: FiTrendingUp, title: 'Market insights' },
]

export default function LandingPage() {
  return (
    <main className="landing-page">
      <div className="city-grid" />
      <section className="hero-section">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="eyebrow">Neon market intelligence</span>
          <h1>Track Markets. Visualize Trends. Make Smarter Decisions.</h1>
          <p>Analyze stock movements with powerful charts, indicators, and real-time insights.</p>
          <div className="hero-actions">
            <Link to="/signup" className="button primary">
              Explore Stocks
            </Link>
            <Link to="/dashboard" className="button secondary">
              View Dashboard
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="dashboard-mockup glass-panel"
          initial={{ opacity: 0, x: 30, rotateX: 6 }}
          animate={{ opacity: 1, x: 0, rotateX: 0, y: [0, -10, 0] }}
          transition={{ duration: 0.8, y: { repeat: Infinity, duration: 5, ease: 'easeInOut' } }}
        >
          <div className="mockup-header">
            <div>
              <span>NVDA</span>
              <strong>$132.76</strong>
            </div>
            <em>+2.92%</em>
          </div>
          <StockChart data={mockChart} compact showIndicators />
          <div className="mockup-cards">
            <span>MA50 128.4</span>
            <span>RSI 62.8</span>
            <span>MACD +3.2</span>
          </div>
        </motion.div>
      </section>

      <section className="feature-grid">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              className="feature-card glass-panel"
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Icon />
              <h3>{feature.title}</h3>
            </motion.div>
          )
        })}
      </section>
    </main>
  )
}
