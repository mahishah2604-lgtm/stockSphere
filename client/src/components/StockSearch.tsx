import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { searchStocks } from '../services/api'
import type { Stock } from '../types'

export default function StockSearch({ compact = false }: { compact?: boolean }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Stock[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    async function runSearch() {
      setLoading(true)
      try {
        const data = await searchStocks(query || 'a')
        if (active) setResults(data)
      } finally {
        if (active) setLoading(false)
      }
    }

    const timer = window.setTimeout(runSearch, 220)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [query])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function openStock(ticker: string) {
    setQuery('')
    setResults([])
    setIsOpen(false)
    navigate(`/dashboard/stocks/${ticker}`)
  }

  return (
    <div className="search-shell" ref={searchRef}>
      <FiSearch />
      <input
        aria-label="Search stocks"
        placeholder={compact ? 'Search ticker' : 'Search Apple, Tesla, Nvidia...'}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="search-results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            {loading ? (
              <div className="search-empty">Scanning markets...</div>
            ) : (
              results.slice(0, 5).map((stock) => (
                <button key={stock.ticker} type="button" onClick={() => openStock(stock.ticker)}>
                  <span className="stock-logo small">{stock.logo}</span>
                  <span>
                    <strong>{stock.ticker}</strong>
                    <small>{stock.companyName}</small>
                  </span>
                  <em className={stock.changePercent >= 0 ? 'profit' : 'loss'}>
                    {stock.changePercent >= 0 ? '+' : ''}
                    {stock.changePercent}%
                  </em>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
