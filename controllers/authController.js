const User = require('../models/user.js')
const jwt = require('jsonwebtoken')

const handleErrors = (err) => {
    console.log('ERROR')
    console.log(err.message, err.code)
    console.log(err)
    let errors = {email: '', password: ''}

    if(err.message === 'Wrong email.') {
        errors.email = 'That email is not registered.'
    }

    if(err.message === 'Wrong email or password.') {
        errors.password = 'The email or password is incorrect.'
    }

    if(err.code === 11000) {
        errors.email = 'That email is already registered.'
    }

    if(err.message.includes('users validation failed:')) {
        Object.values(err.errors).map(({properties}) => {
            errors[properties.path] = properties.message
        })
    }

    return errors
}

const maxAge = 60 * 60 * 24

const createToken = (id) => {
    return jwt.sign({id}, 'secret', {
        expiresIn: maxAge
    })
}

const login_get = (req, res) => {
    res.render('login')
}

const register_get = (req, res) => {
    res.render('register')
}

const login_post = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.verify(email, password)
        const token = await createToken(user._id)
        res.cookie('jwt', token, {maxAge: maxAge * 1000, httpOnly: true})
        res.status(201).json({user: user.email})
    } catch(err) {
        const errors = handleErrors(err)
        console.log(errors)
        res.status(400).json({errors: errors})
    }
}

const register_post = async (req, res) => {
    try {
        const user = await User.create(req.body)
        const token = await createToken(user._id)
        res.cookie('jwt', token, {maxAge: maxAge * 1000, httpOnly: true})
        res.status(200).json({user: user.email})
    } catch(err) {
        const errors = handleErrors(err)
        res.status(400).json({errors: errors})
    }
}

const logout_delete = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/')
}

module.exports = {
    login_get,
    login_post,
    register_get,
    register_post,
    logout_delete
}