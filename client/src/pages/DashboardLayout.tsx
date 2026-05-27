import { Link, Outlet, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  FiActivity,
  FiBarChart2,
  FiBell,
  FiChevronDown,
  FiClock,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiRepeat,
  FiSettings,
  FiStar,
  FiUser,
} from 'react-icons/fi'
import StockSearch from '../components/StockSearch'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/dashboard/market', label: 'Market Overview', icon: FiActivity },
  { to: '/dashboard/watchlist', label: 'Watchlist', icon: FiStar },
  { to: '/dashboard/compare', label: 'Compare Stocks', icon: FiRepeat },
  { to: '/dashboard/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/dashboard/profile', label: 'Profile', icon: FiUser },
  { to: '/dashboard/settings', label: 'Settings', icon: FiSettings },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [clock, setClock] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const nyParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(clock)
  const weekday = nyParts.find((part) => part.type === 'weekday')?.value || ''
  const hour = Number(nyParts.find((part) => part.type === 'hour')?.value || 0)
  const minute = Number(nyParts.find((part) => part.type === 'minute')?.value || 0)
  const minutes = hour * 60 + minute
  const isWeekday = !['Sat', 'Sun'].includes(weekday)
  const marketOpen = isWeekday && minutes >= 570 && minutes < 960
  const renderNav = () => (
    <nav>
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="nav-item"
            onClick={() => setMobileNavOpen(false)}
          >
            <Icon />
            {item.label}
          </NavLink>
        )
      })}
    </nav>
  )

  return (
    <div className="dashboard-shell">
      <aside className="sidebar glass-panel">
        <div className="brand-mark">
          <motion.span
            animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.04, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            SS
          </motion.span>
          <div>
            <strong>StockSphere</strong>
            <small>Quant command center</small>
          </div>
        </div>
        <div className={`market-status ${marketOpen ? 'open' : 'closed'}`}>
          <span />
          <div>
            <strong>Market {marketOpen ? 'Open' : 'Closed'}</strong>
            <small>NYSE clock</small>
          </div>
        </div>
        {renderNav()}
        <button className="logout-button" type="button" onClick={logout}>
          <FiLogOut />
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="topbar glass-panel">
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen((current) => !current)}
          >
            <FiMenu />
          </button>
          <StockSearch compact />
          <div className="topbar-actions">
            <div className="live-clock">
              <FiClock />
              {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <button
              className="icon-button notification-button"
              type="button"
              aria-label="Notifications"
              onClick={() => setShowNotifications((current) => !current)}
            >
              <FiBell />
              <span />
            </button>
            <Link className="avatar profile-avatar" to="/dashboard/profile" aria-label="Open profile">
              <span>{user?.username?.slice(0, 1).toUpperCase() || 'U'}</span>
              <FiChevronDown />
            </Link>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="notification-popover glass-panel"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                >
                  <div className="notification-header">
                    <div>
                      <strong>Notifications</strong>
                      <small>3 market updates</small>
                    </div>
                    <button type="button" onClick={() => setShowNotifications(false)} aria-label="Close notifications">
                      Close
                    </button>
                  </div>
                  <div className="notification-list">
                    <article className="notification-item important">
                      <span />
                      <div>
                        <strong>NVDA crossed MA50</strong>
                        <p>Strong volume confirms momentum on the active board.</p>
                      </div>
                    </article>
                    <article className="notification-item">
                      <span />
                      <div>
                        <strong>NASDAQ momentum positive</strong>
                        <p>Large-cap technology continues to lead today’s session.</p>
                      </div>
                    </article>
                    <article className="notification-item">
                      <span />
                      <div>
                        <strong>Watchlist synced</strong>
                        <p>Your saved symbols are up to date.</p>
                      </div>
                    </article>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              className="mobile-nav glass-panel"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {renderNav()}
            </motion.div>
          )}
        </AnimatePresence>
        <Outlet />
      </main>
      <nav className="bottom-nav glass-panel">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon
          return (
            <NavLink key={item.to} to={item.to} end={item.end} aria-label={item.label}>
              <Icon />
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
