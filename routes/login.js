const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const router = Router()

router.get('/',(req, res) => {
    res.render('login/login', {
        isLogin: true,
    })
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body

    const candidate = await User.findOne({email})

    if(!candidate) return res.redirect('/login#login')

    if(bcrypt.compare(password, candidate.password)) {
        req.session.user = candidate
        req.session.isAuth = true
        req.session.save(e => {
            if(e) {
                throw e
            }

            res.redirect('/')
        })
    } else {
        res.redirect('/login#login')
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})

router.post('/registration', async (req, res) => {
    const {email, name, password, passwordConfirm} = req.body

    const VALID_PASSWORD_CONFIRMATION = password === passwordConfirm
    const NOT_UNIQUE_EMAIL = await User.findOne({email})
    const VALID = !NOT_UNIQUE_EMAIL && VALID_PASSWORD_CONFIRMATION

    if(VALID) {
        const encryptedPessword = await bcrypt.hash(password, 10)

        const user = new User({
            email,
            name,
            password: encryptedPessword,
            cart: {
                items: []
            }
        })

        await user.save()

        res.redirect('/login#login')
    } else {
        res.redirect('/login#register')
    }
})

module.exports = router