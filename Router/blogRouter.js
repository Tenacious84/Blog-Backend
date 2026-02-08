const express = require('express')
const { getBlog, createBlog, updateBlog, deleteBlog, getAllBlogs, getMyBlogs } = require('../Controller/blogController')
const { protect } = require('../Middleware/authMiddleware')
const upload = require('../Middleware/upload')

const router = express.Router()


router.get('/', getAllBlogs)
router.get('/:id', getBlog)
router.get('/myBlogs', protect, getMyBlogs)

router.post('/createBlog', (req, res, next) => {
    console.log('🚀 BLOG ROUTE HIT')
    next()
}, protect, upload.single('image'), createBlog)


// router.post('/createBlog', protect, upload.single('image'), createBlog)
router.put('/:id', protect, updateBlog)
router.delete('/:id', protect, deleteBlog)

module.exports = router