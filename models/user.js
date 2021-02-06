const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {isEmail} = require('validator')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        lowercase: true,
        unique: [true, 'Email already registered.'],
        validate: [isEmail, 'Not a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minLength: [6, 'Please enter a password 6 characters or longer.']

    }
})

userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.statics.verify = async function(email, password) {
    const user = await this.findOne({email})
    if(user) {
        const match = await bcrypt.compare(password, user.password)
        if(match) {
            return user
        } else {
            throw Error('Wrong email or password.')
        }
    } else {
        throw Error('Wrong email.')
    }
}

module.exports = mongoose.model('users', userSchema)