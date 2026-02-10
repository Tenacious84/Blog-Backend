const User = require('../Models/userSchema');
const generateToken = require('../Utility/generateJWT');
const bcrypt = require('bcrypt');

/* =========================
REGISTER USER
========================= */
const registerUser = async (req, res) => {
    try {
        const { author, email, password } = req.body;

        if (!author || !email || !password) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            author,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                _id: user._id,
                author: user.author,
                email: user.email,
                role: user.role
            },
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/* =========================
LOGIN USER
========================= */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        // Find user by email only
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }

        res.status(200).json({
            message: `Welcome ${user.author}`,
            user: {
                _id: user._id,
                author: user.author,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const email = req.body

        const user = await User.findOne({ email })
        res.status(200).json(user)
    }
    catch (err) {

    }

}

module.exports = { registerUser, loginUser , getUser};

