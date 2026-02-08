const jwt = require('jsonwebtoken')


const protect = async (req, res, next) => {
    console.log('🔐 PROTECT HIT, auth header:', req.headers.authorization)


    try {
        const authHeader = req.headers?.authorization

        if (!authHeader) return res.status(400).json('Token not found!')

        const token = authHeader.split(' ')[1]
        if (!token) return res.status(400).json('Token missing!')

        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
        req.user = decoded._id
        console.log('authHeader:', authHeader)
        console.log('token extracted:', token)


    }
    catch (err) {
        return res.status(400).json({ message: 'Protection failed', err })

    }
    console.log('protection complete😌')
    next()
}

module.exports = { protect }