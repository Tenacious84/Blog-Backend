const Blog = require('../Models/blogSchema')
const uploadToCloudinary = require('../Utility/uploadToCloudinary')

const getAllBlogs = async (req, res) => {

    const blogs = await Blog.find().populate('author', 'author _id').sort({ createdAt: -1 })

    if (!blogs) return res.status(404).json('No blogs found!')

    res.status(200).json(blogs)
}

const getBlog = async (req, res) => {
    const { id } = req.params

    const blog = await Blog
        .findById(id)
        .populate('author', 'author _id')

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
    // ✅ Fixed: Changed 'user' to 'author' to match the schema field name
    const myBlogs = await Blog.find({ author: req.user }).populate('author', 'author _id').sort({ createdAt: -1 })

    if (!myBlogs) return res.status(404).json("No blogs found!")

    res.status(200).json(myBlogs)
}

const updateBlog = async (req, res) => {
    console.log("UpdateBlog hit")
    try {
        const { title, subtitle, content } = req.body

        const blog = await Blog.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, subtitle, content },
            { new: true }
        )

        if (!blog) {
            return res.status(404).json({ message: "Blog not found or not authorized" })
        }

        res.status(200).json(blog)
        console.log(blog)

    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error.message)
    }
}

const deleteBlog = async (req, res) => {
    const { id } = req.params

    const blog = await Blog.findByIdAndDelete(id)
    if (!blog) return res.status(404).json('Blog not found!')

    res.status(200).json('Blog has been successfully deleted!')
}

const likeBlog = async (req, res) => {
    const { id } = req.params

    const blog = await Blog.findById(id)
    if (!blog) return res.status(404).json('Blog not found')

    const userId = req.user.toString()
    console.log({ 'user': userId })



    if (blog.likes.includes(userId)) {

        blog.likes = blog.likes.filter(like => like && like.toString() !== userId);
    } else {

        blog.likes.push(userId);
    }



    await blog.save()

    console.log({ 'Blog': blog })
    res.json({
        likesCount: blog.likes.length,
        blog: blog,
        'user': userId,
        'likes': blog.likes
    });
}


module.exports = { getAllBlogs, getBlog, createBlog, updateBlog, deleteBlog, getMyBlogs, likeBlog }