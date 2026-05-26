const express = require('express')
const {
  searchStocks,
  getStock,
  getHistory,
  getTrending,
  getAnalytics,
} = require('../controllers/stocksController')
const { optionalAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/search', optionalAuth, searchStocks)
router.get('/trending', getTrending)
router.get('/analytics', getAnalytics)
router.get('/history/:ticker', getHistory)
router.get('/:ticker', optionalAuth, getStock)

module.exports = router
