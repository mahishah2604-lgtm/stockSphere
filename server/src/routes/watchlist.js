const express = require('express')
const {
  getWatchlist,
  addWatchlistItem,
  removeWatchlistItem,
  togglePinned,
} = require('../controllers/watchlistController')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

router.use(requireAuth)

router.get('/', getWatchlist)
router.post('/add', addWatchlistItem)
router.patch('/pin/:ticker', togglePinned)
router.delete('/remove/:ticker', removeWatchlistItem)
router.delete('/remove', removeWatchlistItem)

module.exports = router
