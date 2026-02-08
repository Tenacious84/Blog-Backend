const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Mongoose Database has been successfully connected!😌')
    }
    catch (err) {
        console.log(err)
        console.log('Could not connect Mongoose Database!😥')
        process.exit(1)

    }
}

module.exports = connectDB