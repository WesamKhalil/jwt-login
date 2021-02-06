const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, 'secret', (err, data) => {
            if(err) {
                res.redirect('/login')
            } else {
                next()
            }
        })
    } else {
        res.redirect('/login')
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if(token) {
        jwt.verify(token, 'secret', async (err, decoded) => {
            if(err) {
                res.locals.user = null
                next()
            } else {
                const user = await User.findById(decoded.id)
                res.locals.user = user
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

module.exports = {
    requireAuth,
    checkUser
}