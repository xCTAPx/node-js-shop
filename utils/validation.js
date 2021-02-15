const { body } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

exports.loginValidator = [
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

exports.registerValidator = [
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

exports.resetValidator = [
    body('email').isEmail().withMessage('Enter correct email!').normalizeEmail(),
    body('email').custom(async value => {
        const user = await User.findOne({email: value})

        return user ? Promise.resolve() : Promise.reject('User with such email does not exist!')
    }).normalizeEmail()
]

exports.productValidator = [
    body('name').notEmpty().withMessage('Empty name field!').trim(),
    body('description').notEmpty().withMessage('Empty description field!').trim(),
    body('price').notEmpty().withMessage('Empty price field!').trim(),
    body('price').isNumeric().withMessage('Price is not number!').trim(),
    body('image').notEmpty().withMessage('Empty name field!').trim(),
]

exports.editProfileValidator = [
    body('name').notEmpty().withMessage('Name field can not be empty!').trim(),
    body('name').isAlpha('en-US').withMessage('Enter correct name! (Only english letters)').trim(),
]