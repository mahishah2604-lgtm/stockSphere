import axios from 'axios'
import type { MarketIndex, Stock, StockPoint, User, WatchlistItem } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5055/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (typeof message === 'string') return message
    if (error.code === 'ERR_NETWORK') {
      return 'Cannot reach the backend. Make sure the server is running on port 5055.'
    }
    return error.message
  }

  return error instanceof Error ? error.message : 'Something went wrong'
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post<{ token: string; user: User }>('/auth/login', payload)
  return data
}

export async function register(payload: {
  username: string
  email: string
  password: string
  confirmPassword: string
}) {
  const { data } = await api.post<{ token: string; user: User }>('/auth/register', payload)
  return data
}

export async function getMe() {
  const { data } = await api.get<{ user: User }>('/auth/me')
  return data.user
}

export async function getTrending() {
  const { data } = await api.get<{ indexes: MarketIndex[]; stocks: Stock[] }>('/stocks/trending')
  return data
}

export async function searchStocks(query: string) {
  const { data } = await api.get<{ results: Stock[] }>('/stocks/search', { params: { q: query } })
  return data.results
}

export async function getStock(ticker: string) {
  const { data } = await api.get<{ stock: Stock }>(`/stocks/${ticker}`)
  return data.stock
}

export async function getStockHistory(ticker: string, range: string) {
  const { data } = await api.get<{ history: StockPoint[] }>(`/stocks/history/${ticker}`, {
    params: { range },
  })
  return data.history
}

export async function getAnalytics() {
  const { data } = await api.get<{
    topGainers: Stock[]
    topLosers: Stock[]
    sectorPerformance: { name: string; value: number; fill: string }[]
    sentiment: { label: string; value: number }[]
  }>('/stocks/analytics')
  return data
}

export async function getWatchlist() {
  const { data } = await api.get<{ items: WatchlistItem[] }>('/watchlist')
  return data.items
}

export async function addToWatchlist(ticker: string) {
  const { data } = await api.post('/watchlist/add', { ticker })
  return data
}

export async function removeFromWatchlist(ticker: string) {
  const { data } = await api.delete(`/watchlist/remove/${ticker}`)
  return data
}

export async function pinWatchlistItem(ticker: string) {
  const { data } = await api.patch(`/watchlist/pin/${ticker}`)
  return data
}

export default api
