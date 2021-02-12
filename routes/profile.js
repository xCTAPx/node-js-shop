const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
    res.render('profile', {
        isProfile: true
    })
})

module.exports = router