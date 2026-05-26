export type StockPoint = {
  label: string
  price: number
  open: number
  high: number
  low: number
  volume: number
  ma50: number
  ma200: number
  rsi: number
  macd: number
  upperBand: number
  lowerBand: number
}

export type Stock = {
  ticker: string
  companyName: string
  sector: string
  price: number
  changePercent: number
  marketCap: string
  logo: string
  description: string
  history: StockPoint[]
}

export type MarketIndex = {
  name: string
  ticker: string
  price: number
  changePercent: number
}

export type User = {
  id: string
  username: string
  email: string
  avatar?: string
  recentSearches: string[]
  recentlyViewed: string[]
}

export type WatchlistItem = {
  id: string
  ticker: string
  companyName: string
  pinned: boolean
  stock: Stock | null
}
