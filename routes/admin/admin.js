const express = require('express')
const app = express()
const router = express.Router()
const postModel = require('../../models/post.js')
const faker = require('faker')
const authenticatedChecker = require('../../helpers/authenticatedChecker.js')

/*

1) route.all() is a middleware
2) As we know that middileware functions have next parameters
3) * this means that matches ever
4) /* this means after the /admin/* all the routes that matches
5) We have already set the default layout in the home, we changed the layout by setting this req.app.locals.layout = 'admin'



*/

router.all('/*',(req,res,next)=>{
    req.app.locals.layout = 'admin'
    next()
})

router.get('/' ,authenticatedChecker.authenticatedChecker, (req , res)=>{
        
        const current_user = req.user
        res.render('admin/index',{user_data:current_user })

   

})



//Random Post Generator
router.get('/randomPost',authenticatedChecker.authenticatedChecker,(req,res)=>{
    res.render('admin/posts/randomPost')
})

router.post('/randomPost',authenticatedChecker.authenticatedChecker,async(req,res)=>{

    for(let i=0;i < req.body.ammount;i++){
        await postModel({    
        title: faker.name.title(),
        body: faker.lorem.paragraph(),
        status: 'public',
        allowComments: faker.datatype.boolean()
        
        }).save()
      
    }
    
    res.redirect('/admin/posts')
})


router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });





module.exports = router