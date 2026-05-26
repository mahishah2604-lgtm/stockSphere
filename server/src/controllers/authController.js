const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

function toPublicUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    recentSearches: user.recentSearches || [],
    recentlyViewed: user.recentlyViewed || [],
  }
}

async function register(req, res) {
  const { username, email, password, confirmPassword } = req.body

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' })
  }

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists' })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ username, email, passwordHash })

  return res.status(201).json({
    token: createToken(user),
    user: toPublicUser(user),
  })
}

async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  return res.json({
    token: createToken(user),
    user: toPublicUser(user),
  })
}

async function me(req, res) {
  const user = await User.findById(req.user.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  return res.json({ user: toPublicUser(user) })
}

module.exports = { register, login, me }
