const jwt = require('jsonwebtoken')

function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' })
  }

  const token = header.slice('Bearer '.length)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    return next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return next()
  }

  const token = header.slice('Bearer '.length)
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    req.user = null
  }

  return next()
}

module.exports = { requireAuth, optionalAuth }
