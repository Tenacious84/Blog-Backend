const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    author: { type: String, required: true, trim: true },
    role: { type: String, required: true, enum: ['blogger', 'admin'], default: 'blogger' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, trim: true, unique: true }
}, { timeStamps: true })

module.exports = mongoose.model('User', userSchema)