const {Router} = require('express')

const router = Router()

router.get('/', (req, res) => {
    res.render('main', {
        isMain: true,
        title: 'Main Page'
    })
})

module.exports = router