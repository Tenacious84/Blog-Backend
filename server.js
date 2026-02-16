const express = require('express')
const connectDB = require('./Config/db')
const dotenv = require('dotenv')
const userRouter = require('./Router/userRouter')
const blogRouter = require('./Router/blogRouter')
const cors = require('cors')

dotenv.config()
const app = express()
app.use(express.json())
connectDB()
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://blogfrontendapplication.netlify.app"
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))


app.use('/api/user', userRouter)
app.use('/api/blog', blogRouter)

console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.JWT_SECRET)

PORT = process.env.PORT

app.listen(PORT, () => console.log(`Server is runnning on http://localhost:${PORT}`))


