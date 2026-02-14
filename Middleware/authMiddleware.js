const jwt = require('jsonwebtoken');

/**
 * Protect middleware - Verifies JWT token and attaches user to request
 */
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      console.log('🔐 PROTECT HIT, auth header:', req.headers.authorization);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('Decoded token:', decoded);

      // ✅ CRITICAL: Set req.user to the user ID from the token
      req.user = decoded.id;

      console.log('req.user set to:', req.user);

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.log('🔐 PROTECT HIT, auth header:', req.headers.authorization);
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };