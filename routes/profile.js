const { Router } = require('express')
const { validationResult } = require('express-validator')
const User = require('../models/user')
const routes = require('../middlewares/routes')
const { editProfileValidator } = require('../utils/validation')

const router = Router()

router.get('/', routes, (req, res) => {
    try {
        const profileError = req.flash('profileError')

        res.render('profile', {
                isProfile: true,
                user: req.user,
                profileError
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/edit', routes, editProfileValidator, async (req, res) => {
    try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            req.flash('profileError', errors.errors[0].msg)
            return res.status(400).redirect('/profile')
        }

        const user = await User.findById(req.user._id)

        const enhancedUser = {
            name: req.body.name,
            avatar: req.file ? req.file.path : undefined
        }

        Object.assign(user, enhancedUser)
        await user.save()
        
        res.redirect('/profile')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router