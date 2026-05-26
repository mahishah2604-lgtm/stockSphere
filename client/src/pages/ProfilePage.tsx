import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="page-stack">
      <section className="profile-panel glass-panel">
        <div className="avatar large">{user?.username?.slice(0, 1).toUpperCase()}</div>
        <div>
          <span className="eyebrow">User profile</span>
          <h1>{user?.username}</h1>
          <p>{user?.email}</p>
        </div>
      </section>
      <section className="dual-grid">
        <article className="glass-panel list-panel">
          <h2>Saved stocks</h2>
          <p>Open your watchlist to manage saved equities and pinned favorites.</p>
        </article>
        <article className="glass-panel list-panel">
          <h2>Recently viewed</h2>
          {(user?.recentlyViewed?.length ? user.recentlyViewed : ['AAPL', 'NVDA', 'MSFT']).map((ticker) => (
            <div className="list-row" key={ticker}>
              <span>{ticker}</span>
              <strong>Stock terminal session</strong>
            </div>
          ))}
        </article>
      </section>
    </div>
  )
}
