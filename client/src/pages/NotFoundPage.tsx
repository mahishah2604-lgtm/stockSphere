import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="auth-page">
      <section className="auth-card glass-panel">
        <span className="eyebrow">404</span>
        <h1>Signal lost</h1>
        <p>The market route you requested does not exist.</p>
        <Link to="/" className="button primary">
          Return home
        </Link>
      </section>
    </main>
  )
}
