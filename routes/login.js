const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const sendMessage = require('../nodemailer')
const keys = require('../keys')
const crypto = require('crypto')

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
        subject: 'Successful SignUp',
        html: `<h1>Registration is successful</h1>
        <p>${name}, you have registered successful! Visit our website and sign in:</p>
        <hr/>
        <a href=${keys.BASE_URL}>go to the market</a>`
    })
})

router.get('/reset', (req, res) => {
    const resetError = req.flash('resetError')
    const resetSuccess = req.flash('resetSuccess')

    res.render('login/reset', {
        resetError,
        resetSuccess
    })
})

router.post('/reset', async (req, res) => {
    const candidate = await User.findOne({ email: req.body.email })
    if(candidate) {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) throw err

            const resetToken = buffer.toString('hex')
            const resetTokenExp = Date.now() + 600 * 1000

            candidate.resetToken = resetToken
            candidate.resetTokenExp = resetTokenExp
            await candidate.save()

            sendMessage(req.body.email, {
                subject: 'Reset Password',
                html: `<h1>Reset password</h1>
                <p>For restoring password visit link below:</p>
                <p>If you didn't forget password, please don't pay attention for this letter.</p>
                <hr/>
                <a href=${keys.BASE_URL + `password/${resetToken}`}>reset password</a>`
            })
        })

        req.flash('resetSuccess', `Letter with link for restoring your password has been sent to email ${req.body.email}`)
        return res.redirect('/login/reset')
    } else {
        req.flash('resetError', 'User with such email does not exist!')
        return res.redirect('/login/reset')
    }
})

router.get('/password/:resetToken', async (req, res) => {
    const resetToken = req.params.resetToken

    const candidate = await User.findOne({resetToken})

    if(candidate) {
        res.render('login/password', {
            resetToken,
            userId: candidate._id.toString()
        }) 
    } else {
        req.flash('resetError', 'Such user has not found!')
        return res.redirect('/login/reset')
    }
})

router.post('/password', async (req, res) => {
    const { password, passwordConfirm, resetToken, userId } = req.body

    const candidate = await User.findOne({
        _id: userId,
        resetToken,
        resetTokenExp: {$gt: Date.now()}
    })

    if(!candidate) {
        return res.render('login/reset', {
            resetError: 'Your token has been expired! Try to get new one'
        })
    }

    if(password !== passwordConfirm) {
        req.flash('loginError', 'Password has been confirmed wrong')
        return res.redirect('/login#login')
    } else {
        const newPassword = await bcrypt.hash(password, 10)
        candidate.password = newPassword
        candidate.resetToken = undefined
        candidate.resetTokenExp = undefined
        await candidate.save()

        return res.redirect('/login#login')
    }
})

module.exports = router