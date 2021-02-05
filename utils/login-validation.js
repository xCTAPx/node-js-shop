const { body } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

module.exports = [
    body('email').isEmail().withMessage('Uncorrect email!').normalizeEmail(),
    body('password').isLength({min: 6, max: 52}).withMessage('Enter correct email (6 - 52 symbols length)').trim(),
    body('email').custom(async value => {
        const candidate = await User.findOne({email: value})

        if(!candidate) {
            return Promise.reject(`User with such email doesn't exist`)
        }
            return Promise.resolve()
    }).trim(),
    body('password').custom(async (value, {req}) => {
        const candidate = await User.findOne({email: req.body.email})

        const VALID_PASSWORD = await bcrypt.compare(value, candidate.password)

        return VALID_PASSWORD ? Promise.resolve() : Promise.reject('Invalid password!')
    }).trim()
]