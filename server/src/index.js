const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(compression())
app.use(morgan('dev'))

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

const authRoutes = require('./routes/auth')
const stockRoutes = require('./routes/stocks')
const watchlistRoutes = require('./routes/watchlist')

app.use('/api/auth', authRoutes)
app.use('/api/stocks', stockRoutes)
app.use('/api/watchlist', watchlistRoutes)

app.use((req, res) => {
  res.status(404).json({ message: `Not found - ${req.originalUrl}` })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

const { connectDB } = require('./db')

const PORT = process.env.PORT || 5000
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })

