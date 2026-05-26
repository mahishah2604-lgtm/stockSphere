const mongoose = require('mongoose')

const WatchlistItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ticker: { type: String, required: true, trim: true, uppercase: true },
    companyName: { type: String, required: true, trim: true },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
)

WatchlistItemSchema.index({ user: 1, ticker: 1 }, { unique: true })

module.exports = mongoose.model('WatchlistItem', WatchlistItemSchema)
