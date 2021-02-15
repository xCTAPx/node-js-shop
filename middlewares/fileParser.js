const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedExts = ['image/png', 'image/jpg', 'image/jpeg']
    const ext = file.mimetype

    if(allowedExts.includes(ext)) cb(null, true)
    else cb(null, false)
}

module.exports = multer({
    storage,
    fileFilter
})