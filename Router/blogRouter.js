const express = require('express')
const { getBlog, createBlog, updateBlog, deleteBlog, getAllBlogs, getMyBlogs, likeBlog } = require('../Controller/blogController')
const { protect } = require('../Middleware/authMiddleware')
const upload = require('../Middleware/upload')

const router = express.Router()


router.get('/', getAllBlogs)
router.get('/myBlogs', protect, getMyBlogs)
router.get('/:id', getBlog)
router.post('/likeBlog/:id', protect, likeBlog)

router.post('/createBlog', (req, res, next) => {
    console.log('🚀 BLOG ROUTE HIT')
    next()
}, protect, (req, res, next) => {
    upload.single('image')(req, res, function (err) {

        if (err) {

            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({
                    message: 'Image too large. Max size is 5MB.'
                })
            }

            if (err.message === 'Only image files are allowed') {
                return res.status(415).json({
                    message: err.message
                })
            }

            return res.status(400).json({
                message: err.message
            })
        }

        next()
    })
}, createBlog)


router.put('/updateBlog/:id', protect, updateBlog)
router.delete('/:id', protect, deleteBlog)

module.exports = router