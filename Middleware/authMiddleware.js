const jwt = require('jsonwebtoken')


const protect = async (req, res, next) => {
  let token


  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {

      token = req.headers.authorization.split(' ')[1]

      console.log('🔐 PROTECT HIT, auth header:', req.headers.authorization)


      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      console.log('Decoded token:', decoded)


      req.user = decoded.id

      console.log('req.user set to:', req.user)

      next()
    } catch (error) {
      console.error('Token verification failed:', error.message)
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }

  if (!token) {
    console.log('🔐 PROTECT HIT, auth header:', req.headers.authorization)
    return res.status(401).json({ message: 'Not authorized, no token' })
  }
}

module.exports = { protect }