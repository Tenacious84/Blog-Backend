const User = require('../Models/userSchema');
const bcrypt = require('bcrypt');
const generateToken = require('../Utility/generateJWT')

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
            // ✅ CRITICAL FIX: Convert ObjectId to string
            token: generateToken({
                id: user._id.toString(),
                role: user.role
            })


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

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }


        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials!' });
        }
        console.log({
            message: `Welcome ${user.author}`,
            user: {
                _id: user._id,
                author: user.author,
                email: user.email,
                role: user.role

            },
            token: generateToken(user._id.toString(), user.role)
        })
        res.status(200).json({
            message: `Welcome ${user.author}`,
            user: {
                _id: user._id,
                author: user.author,
                email: user.email,
                role: user.role

            },
            // ✅ CRITICAL FIX: Convert ObjectId to string
            token: generateToken({
                id: user._id.toString(),
                role: user.role
            })

        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { registerUser, loginUser };