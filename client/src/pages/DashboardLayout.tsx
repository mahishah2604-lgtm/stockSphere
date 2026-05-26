import { Link, Outlet, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import {
  FiActivity,
  FiBarChart2,
  FiBell,
  FiGrid,
  FiLogOut,
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

  return (
    <div className="dashboard-shell">
      <aside className="sidebar glass-panel">
        <div className="brand-mark">
          <span>SS</span>
          <div>
            <strong>StockSphere</strong>
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className="nav-item">
                <Icon />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <button className="logout-button" type="button" onClick={logout}>
          <FiLogOut />
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="topbar glass-panel">
          <StockSearch compact />
          <div className="topbar-actions">
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
              {user?.username?.slice(0, 1).toUpperCase() || 'U'}
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
        <Outlet />
      </main>
    </div>
  )
}
