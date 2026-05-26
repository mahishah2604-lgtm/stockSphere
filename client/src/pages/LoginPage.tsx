import { motion } from 'framer-motion'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../services/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function submitLogin(payload: { email: string; password: string }) {
    setError('')
    setLoading(true)
    try {
      await login(payload)
      navigate('/dashboard')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await submitLogin({ email, password })
  }

  return (
    <main className="auth-page">
      <motion.form
        className="auth-card glass-panel"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="eyebrow">Welcome back</span>
        <h1>Login</h1>
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="button primary" type="submit" disabled={loading}>
          {loading ? 'Opening terminal...' : 'Login'}
        </button>
        <button
          className="button secondary"
          type="button"
          disabled={loading}
          onClick={() => submitLogin({ email: 'test@example.com', password: 'password123' })}
        >
          Use demo account
        </button>
        <p className="auth-switch">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </motion.form>
    </main>
  )
}
