const Blog = require('../Models/blogSchema')
const uploadToCloudinary = require('../Utility/uploadToCloudinary')

const getAllBlogs = async (req, res) => {

    const blogs = await Blog.find().populate('author', 'author')

    if (!blogs) return res.status(404).json('No blogs found!')

    res.status(200).json(blogs)
}

const getBlog = async (req, res) => {
    const { id } = req.params

    const blog = await Blog
        .findById(id)
        .populate('author', 'author')

    if (!blog) return res.status(400).json('Blog not found!')

    res.status(200).json(blog)
}

const createBlog = async (req, res) => {
    console.log('--- MULTER CHECK ---')
    console.log('BODY:', req.body)
    console.log('FILE:', req.file)


    try {
        console.log("I'm here")
        const { title, subtitle, content } = req.body

        if (!title || !subtitle || !content) return res.status(400).json('All fields are required!')

        if (!req.file) return res.status(400).json({ message: 'Image is required' })

        const image = await uploadToCloudinary(req.file.buffer, 'image')

        const blog = await Blog.create({ author: req.user, title, subtitle, content, imgUrl: image.secure_url })
        console.log(`I am here ${blog}`)
        res.status(200).json(blog)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
    console.log('BODY:', req.body)
    console.log('FILE:', req.file)


}

const getMyBlogs = async (req, res) => {
    const myBlogs = await Blog.find({ user: req.user }).populate('author', 'author')

    if (!myBlogs) return res.status(404).json("No blogs found!")

    res.status(200).json(myBlogs)
}

const updateBlog = async (req, res) => {
    const { id } = req.params

    const blog = await Blog.findById(id)
    if (!blog) return res.status(404).json('Blog not found!')


    Object.assign(blog, req.body)
    blog.save()
    res.status(200).json(blog)
}

const deleteBlog = async (req, res) => {
    const { id } = req.params

    const blog = await Blog.findByIdAndDelete(id)
    if (!blog) return res.status(404).json('Blog not found!')

    res.status(200).json('Blog has been successfully deleted!')
}



module.exports = { getAllBlogs, getBlog, createBlog, updateBlog, deleteBlog, getMyBlogs }