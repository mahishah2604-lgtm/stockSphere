import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="page-stack">
      <section className="section-header">
        <div>
          <span className="eyebrow">Settings</span>
          <h1>Terminal preferences</h1>
        </div>
      </section>
      <section className="settings-grid">
        <article className="glass-panel setting-card">
          <FiMoon />
          <div>
            <h2>Dark mode</h2>
            <p>Neon night terminal theme is active.</p>
          </div>
          <button type="button" className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}>
            {theme === 'dark' ? 'On' : 'Use'}
          </button>
        </article>
        <article className="glass-panel setting-card">
          <FiSun />
          <div>
            <h2>Light mode</h2>
            <p>Optional bright trading desk palette for daytime analysis.</p>
          </div>
          <button type="button" className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}>
            {theme === 'light' ? 'On' : 'Use'}
          </button>
        </article>
      </section>
    </div>
  )
}
