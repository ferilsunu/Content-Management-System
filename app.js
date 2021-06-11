const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const hbs = require('express-handlebars')
const mongoose = require('mongoose')
const {select,GenerateTime} = require('./helpers/hb-helpers.js')
const methodOverride = require('method-override')
const upload = require('express-fileupload')
const session = require('express-session')
const flash = require('connect-flash')
const {url} = require('./config/db')
const passport = require('passport')

//This helos in extracting body infromation from the post request
app.use(express.urlencoded({extended: true}))
//This help in parsing the request body to json, so we can use the body data here in our app
app.use(express.json())

//MethodOverRide
app.use(methodOverride('_method'))

//Connection with database
mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{
    console.log("Database Connected")
}).catch(error=>console.log(error))

app.use(express.static(path.join(__dirname,'/public')));
//Telling Express to use this engine
app.engine('handlebars',hbs({defaultLayout:'home', helpers: {select:select,GenerateTime:GenerateTime}}))
//Telling express to use handlebars and view engine
app.set('view engine','handlebars')
//Telling Express to use express-fileupload. This will add file property to the body of request
app.use(upload())

//Session Middileware
app.use(session({
    secret: 'FerilCodingKing',
    resave: true,
    saveUninitialized: true
}))

//Flash Middileware
//Middileware attached to the request. Now we can use req.sessions and req.flash from anywhere
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())


app.use((req,res,next)=>{
    //We can set local variables to be used later on the response object
    //We set it by using .locals and .variable_name = variable_content 
    res.locals.success_message  = req.flash('success_message')
    res.locals.error_message = req.flash('error_message')

    next()
})


//Registering our custom routes

const homeRoute     =      require('./routes/home/home')
const adminRoute    =      require('./routes/admin/admin')
const postsRoute    =      require('./routes/admin/posts')
const categoryRoute =      require('./routes/category/category')
const commentsRoute =      require('./routes/admin/commentsRouter')

app.use('/',homeRoute)
app.use('/admin',adminRoute)
app.use('/admin/posts',postsRoute)
app.use('/admin/category',categoryRoute)
app.use('/admin/comments',commentsRoute)





app.listen(port,()=>{
    console.log('Server is up and running on ' + port)
})