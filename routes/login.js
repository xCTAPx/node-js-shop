const {Router} = require('express')
const User = require('../models/user')

const router = Router()

router.get('/',(req, res) => {
    res.render('login/login', {
        isLogin: true,
    })
})

router.post('/login', async (req, res) => {
    const user = await User.findById('5ffea8d9255d4f06448cc56f')
    req.session.user = user
    req.session.isAuth = true
    req.session.save(e => {
        if(e) {
            throw e
        }

        res.redirect('/')
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})

router.post('/register', (req, res) => {
    res.redirect('/')
})

module.exports = router