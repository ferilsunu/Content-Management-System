const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const hbs = require('express-handlebars')
const mongoose = require('mongoose')
const {select,GenerateTime,paginate} = require('./helpers/hb-helpers.js')
const methodOverride = require('method-override')
const upload = require('express-fileupload')
const session = require('express-session')
const flash = require('connect-flash')
const {url} = require('./config/db')
const passport = require('passport')


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride('_method'))
mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{
    console.log("Database Connected")
}).catch(error=>console.log(error))

app.use(express.static(path.join(__dirname,'/public')));
app.engine('handlebars',hbs({defaultLayout:'home', helpers: {select:select,GenerateTime:GenerateTime, paginate:paginate}}))

app.set('view engine','handlebars')

app.use(upload())

//Session Middileware
app.use(session({
    secret: 'FerilCodingKing',
    resave: true,
    saveUninitialized: true
}))


app.use(flash())
app.use(passport.initialize())
app.use(passport.session())


app.use((req,res,next)=>{ 
    res.locals.success_message  = req.flash('success_message')
    res.locals.error_message = req.flash('error_message')

    next()
})



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