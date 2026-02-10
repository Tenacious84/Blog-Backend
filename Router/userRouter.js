const express = require('express')
const { loginUser, registerUser, getUser } = require('../Controller/userController')
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/', getUser)

module.exports = router