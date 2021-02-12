const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
    res.render('profile', {
        isProfile: true,
        user: req.user
    })
})

module.exports = router