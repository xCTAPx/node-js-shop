const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const sendMessage = require('../nodemailer')
const keys = require('../keys')
const crypto = require('crypto')
const { validationResult } = require('express-validator')
const loginValidator = require('../utils/login-validation')
const registerValidation = require('../utils/register-validation')
const resetValidation = require('../utils/reset-validator')

const router = Router()

router.get('/',(req, res) => {
    try {
        const loginError = req.flash('loginError')
        const registerError = req.flash('registerError')
        res.render('login/login', {
            isLogin: true,
            loginError,
            registerError
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/login', loginValidator, async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.flash('loginError', errors.errors[0].msg)
            return res.status(400).redirect('/login#login')
        } else {
            
            req.session.isAuth = true
            req.session.user = await User.findOne({email: req.body.email})
            req.session.save(e => {
                if(e) {
                    throw e
                }

                res.redirect('/')
            })
        } 
    } catch (e) {
        console.log(e)
    }  
})

router.get('/logout', (req, res) => {
    try {
       req.session.destroy(() => {
            res.redirect('/login')
        }) 
    } catch (e) {
        console.log(e)
    }
})

router.post('/registration', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.flash('registerError', errors.errors[0].msg)
            return res.status(400).redirect('/login#register')
        }

        const {email, name, password} = req.body

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
    } catch (e) {
        console.log(e)
    }
    
})

router.get('/reset', (req, res) => {
    try {
        const resetError = req.flash('resetError')
        const resetSuccess = req.flash('resetSuccess')

        res.render('login/reset', {
            resetError,
            resetSuccess
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/reset', resetValidation, async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            console.log(errors.errors[0].msg)
            req.flash('resetError', errors.errors[0].msg)
            return res.status(400).redirect('/login#register')
        }

        const candidate = await User.findOne({email: req.body.email})

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
    } catch (e) {
        console.log(e)
    }  
})

router.get('/password/:resetToken', async (req, res) => {
    try {
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
    } catch (e) {
        console.log(e)
    }
})

router.post('/password', async (req, res) => {
    try {
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
    } catch (e) {
        console.log(e)
    }
})

module.exports = router