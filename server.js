//require the packages
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const logger = require('morgan')
const path = require('path')
const connectDB = require('./config/database')

//require routes
const mainRoutes = require('./routes/main')
const postRoutes = require('./routes/posts')
const commentRoute = require('./routes/comments')

//application setup
const app = express()

//Env file
require('dotenv').config()

//Connect to database
connectDB()

//Passport config
require('./config/passport')(passport)

//EJS views, body-parser, express-static

app.set('view engine', 'ejs')
// app.set('views', path.join(__dirname, '/views'))
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Logging
app.use(logger('dev'))

//setup session
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
	})
)

//Passport Initialization
app.use(passport.initialize())

//use passport to deal with session
app.use(passport.session())

//Forms for put/delete
app.use(methodOverride('_method'))

// mongoose.connect(process.env.DB_CONNECT)
// .then(() => console.log('Database connected'))
// .catch(err => console.log(err))

//flash messages
app.use(flash())

//Use routes

app.use('/', mainRoutes)
app.use('/post', postRoutes)
app.use('/comment', commentRoute)

// app.get("/register", (req, res) => {
//     res.render("register")
// })

// app.get("/login", (req, res) => {
//     res.render("login")
// })

// app.get("/playfeed", (req, res) => {
//     res.render("playfeed")
// })

//Start the server
app.listen(process.env.PORT || 2121, () => console.log('Server running'))
