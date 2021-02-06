const express = require('express')
const app = express()
const authRoutes = require('./routes/authRoutes.js')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const {requireAuth, checkUser} = require('./middleware/authMiddleware.js')

const dbURI = 'mongodb+srv://FCC:' + process.env.PW + '@cluster0.1mvbk.mongodb.net/jwt-auth?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true }, () => {
    console.log('Connected to mongoDB.')
})

app.set('view engine', 'ejs')

app.use(cookieParser())
app.use(express.json())
app.use('/public', express.static('public'))

app.get('*', checkUser)

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/success', requireAuth, (req, res) => {
    res.render('success')
})

app.use(authRoutes)

app.listen(process.env.PORT || 3000, (req, res) => {
    console.log('Listening on port ' + (process.env.PORT || 3000))
})