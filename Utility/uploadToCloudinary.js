const cloudinary = require('../Config/cloudinary')
const streamifier = require('streamifier')

const uploadToCloudinary = (buffer, folder = 'upload') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }

        )
        streamifier.createReadStream(buffer).pipe(stream)
    })
}

module.exports = uploadToCloudinary