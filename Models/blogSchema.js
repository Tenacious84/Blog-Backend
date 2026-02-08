const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, lowercase: true, trim: true },
    imgUrl: { type: String },
    content: { type: String, required: true, trim: true }
}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)