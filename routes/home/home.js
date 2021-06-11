const express = require('express')
const app = express()
const router = express.Router()
const postModel = require('../../models/post')
const categoryModel = require('../../models/category')
const userModel = require('../../models/user')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'home'
    next()
})


router.get('/' , async (req , res)=>{
    const fetched_posts = await postModel.find({}).lean()
    const fetched_cat = await categoryModel.find({}).lean()
    
    const current_user = req.user

    res.render('home/index',{
        posts: fetched_posts,
        category: fetched_cat,
        user_data: current_user
    })


 
})

router.get('/login' , (req , res)=>{

    if (req.user) {
        res.redirect('/admin')
    } else{res.render('home/login')}
 

})


passport.use(new LocalStrategy({usernameField:'email'}, (email,password,done)=>{
    
    userModel.findOne({email:email}).then((user)=>{
     if (!user) return done(null,false,{message: "No User found"})
     bcrypt.compare(password,user.password,(err,matched)=>{
        if(err)return err
        if(matched){
            
            return done(null,user)
        }else {return done(null,false,{message:"Incorrect Password"})}


     })

    




       
    })


   
  
 }))


 passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    userModel.findById(id, function(err, user) {
      done(err, user);
    });
  });



router.post('/login', 
(req,res,next)=>{
passport.authenticate('local', { successRedirect: '/admin',
failureRedirect: '/login',
failureFlash: 'Incorrect Password'}

)(req,res,next)}


)

router.get('/register' , (req , res)=>{

    
    if (req.user) {
        res.redirect('/admin')
    } else{
        res.render('home/register')
    }

    
 
 })


 router.post('/register',async (req,res)=>{



    const fetch_user = await userModel.findOne({email:req.body.email})
    if (!fetch_user) {
    const body = req.body
    const newUser = await new userModel({firstName: body.firstName ,lastName: body.lastName,email: body.email,password:body.password})
    //Hasing Passowrd
    bcrypt.genSalt(8, function(err, salt) {
         bcrypt.hash(req.body.password, salt, function(err, hash) {
        newUser.password = hash
        newUser.save()
        });
    });
    req.flash('success_message', 'User created, please login')
    res.redirect('/login')
        
    } else {
        req.flash('error_message', 'User Exists, please login')
        res.redirect('/login')
    }
    


 })


 router.get('/post/:id' , async (req , res)=>{
    const id = req.params.id
    const fetched_post = await postModel.findOne({_id:id}).lean()
    const fetched_cat = await categoryModel.find({}).lean()
    res.render('home/single-post',
    {fetched_post: fetched_post, category: fetched_cat})
 
 })



 module.exports = router