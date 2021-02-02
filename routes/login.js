const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const sendMessage = require('../nodemailer')

const router = Router()

router.get('/',(req, res) => {
    const loginError = req.flash('loginError')
    const registerError = req.flash('registerError')
    res.render('login/login', {
        isLogin: true,
        loginError,
        registerError
    })
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body

    const candidate = await User.findOne({email})

    if(!candidate) {
        req.flash('loginError', 'Wrong email and/or password')
        return res.redirect('/login#login')
    }

    const VALID_PASSWORD = await bcrypt.compare(password, candidate.password)

    if(VALID_PASSWORD) {
        req.session.user = candidate
        req.session.isAuth = true
        req.session.save(e => {
            if(e) {
                throw e
            }

            res.redirect('/')
        })
    } else {
        req.flash('loginError', 'Wrong email and/or password')
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

    if(NOT_UNIQUE_EMAIL) {
        req.flash('registerError', 'User with this email has already registered')
        return res.redirect('/login#register')
    }

    if(!VALID_PASSWORD_CONFIRMATION) {
        req.flash('registerError', 'Password has been confirmed wrong')
        return res.redirect('/login#register')
    }
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

    sendMessage(email, {
        subject: 'Registration',
        html: `<h1>Registration is successful</h1>
        <p>${name}, you have registered successful! Visit our website and sign in:</p>
        <a href="http://127.0.0.1:3000/login/">go to the market</a>`
    })
})

module.exports = router