const User = require('../Models/userSchema')
const generateToken = require('../Utility/generateJWT')


const registerUser = async (req, res) => {
    const { author, email, password } = req.body

    if (!author || !email || !password) return res.status(400).json('All fields are required!')

    const user = await User.create({ author, email, password })

    res.status(200).json({
        message: 'User created',
        user,
        token: generateToken(user._id, user.role)
    })
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json('All fields are required!')

    const user = await User.findOne({ email, password })

    if (!user) return res.status(404).json('User not found!')

    res.status(200).json({
        message: `Welcome ${user.author}`,
        _id: user._id,
        name: user.author,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id, user.role)

    })
    res.status(200).json()
}

module.exports = { registerUser, loginUser }