const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    imgUrl: { type: String },
    content: { type: String, required: true, trim: true },
    likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] }
}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)