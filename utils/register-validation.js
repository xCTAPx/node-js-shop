const { body } = require('express-validator')
const User = require('../models/user')

module.exports = [
    body('email').custom(async value => {
        const user = await User.findOne({email: value})

        return user ? Promise.reject('User with such email already exists!') : Promise.resolve()
    }).normalizeEmail(),
    body('name').notEmpty().withMessage('Enter name! This field is required!').trim(),
    body('name').isAlpha('en-US').withMessage('Enter correct name! (Only english letters)').trim(),
    body('password').isLength({min: 6, max: 52}).withMessage('Enter correct password (from 6 to 52 letters)!').trim(),
    body('password').custom((value, {req}) => {
        return value === req.body.passwordConfirm ? Promise.resolve() : Promise.reject('You repeated password wrong!')
    }).trim()
]