const User = require('../Models/userSchema');
const bcrypt = require('bcrypt');
const generateToken = require('../Utility/generateJWT')


const registerUser = async (req, res) => {
    try {
        const { author, email, password } = req.body

        if (!author || !email || !password) {
            return res.status(400).json({ message: 'All fields are required!' })
        }


        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.status(409).json({
                error: "EMAIL_EXISTS",
                message: "User already registered"
            })

        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            author,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            message: 'User created successfully',
            user: {
                _id: user._id,
                author: user.author,
                email: user.email,
                role: user.role

            },

            token: generateToken({
                id: user._id.toString(),
                role: user.role
            })


        })
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required!' })
        }


        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials!' })
        }



        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials!' })
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

            token: generateToken({
                id: user._id.toString(),
                role: user.role
            })

        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
};


module.exports = { registerUser, loginUser }