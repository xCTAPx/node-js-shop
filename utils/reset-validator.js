const { body } = require('express-validator')
const User = require('../models/user')

module.exports = [
    body('email').isEmail().withMessage('Enter correct email!').normalizeEmail(),
    body('email').custom(async value => {
        const user = await User.findOne({email: value})

        return user ? Promise.resolve() : Promise.reject('User with such email does not exist!')
    }).normalizeEmail()
]