const { body } = require('express-validator')
const User = require('../models/user')

module.exports = [
    body('email').isEmail().withMessage('Enter correct email!').normalizeEmail(),
    body('email').custom(async value => {
        const user = await User.findOne({email: value})

        return user ? Promise.resolve() : Promise.reject('User with such email does not exist!')
    }).normalizeEmail(),
    body('password').isLength({min: 6, max: 52}).withMessage('Enter correct password (from 6 to 52 symbols)!').trim(),
    body('password').custom((value, {req}) => {
        return value === req.body.passwordConfirm ? Promise.resolve() : Promise.reject('You confirmed password wrong!')
    })
]