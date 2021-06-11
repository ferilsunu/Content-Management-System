const express = require('express')
const app = express()
const router = express.Router()
const postModel = require('../../models/post.js')
const categoryModel = require('../../models/category.js')
const {isEmpty} = require('../../helpers/upload-helpers.js')
const fs = require('fs')
const path = require('path')
const uploads_dir = path.join(__dirname,'../../public/uploads/')
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

router.get('/',authenticatedChecker.authenticatedChecker,(req,res)=>{
    //About Lean: https://kb.objectrocket.com/mongo-db/how-to-use-mongoose-lean-926

     postModel.find().lean().then((data)=>{
        
    res.render('admin/posts/index',{
       data:  data
 
     })
 

    })
  


})


router.get('/createPost',authenticatedChecker.authenticatedChecker,async (req,res)=>{
   const cats = await categoryModel.find({}).lean()
    res.render('admin/posts/createPost',{
        category: cats
    })
   
})

let filename = ''

router.post('/createPost',authenticatedChecker.authenticatedChecker, async (req,res)=>{


    if (!isEmpty(req.files)) {
        const files= req.files.uploadedFile
         filename =  Date.now() + '-' + files.name
        files.mv('./public/uploads/'+filename,(err)=>{
            if(err){
                return err
            }
        
        })
    }

 

    let allowComments = true
    if (req.body.allowComments) {
        allowComments = 'true'
    } else{
        allowComments = 'false'
    }
    
    await postModel({title:req.body.title,body:req.body.body,status:req.body.status,allowComments:allowComments,file:filename,category: req.body.category}).save()
    req.flash('success_message','Post was created succesfully')
    res.redirect('/admin/posts')

})



router.get('/edit/:id', (req,res)=>{
    const id = req.params.id
     postModel.findById(id).lean().then(async (post)=>{
        //About Lean: https://kb.objectrocket.com/mongo-db/how-to-use-mongoose-lean-926
        //Lean Just increases the speed of the process! It somehow fixes the problem with the express-handlebras as well
        const fetched_category = await categoryModel.find({}).lean()

        res.render('admin/posts/editPosts',{post:post,cat:fetched_category})
    })
  
   
})

router.put('/edit/:id',authenticatedChecker.authenticatedChecker,async(req,res)=>{
    let allowComments = true
    if (allowComments) {
        allowComments = true
    } else {
        allowComments = false
    }
    const id = req.params.id


    if (!isEmpty(req.files)) {
        const files= req.files.uploadedFile
        filename =  Date.now() + '-' + files.name
        files.mv('./public/uploads/'+filename,(err)=>{
            if(err){
                return err
            }
        
        })
    }

    await postModel.findOneAndUpdate(id,{title: req.body.title, body:req.body.body,status:req.body.status,allowComments:allowComments, file: filename})
    req.flash('success_message', 'Post was edited sucessfully')
    res.redirect('/admin/posts')
})


router.delete('/delete/:id',authenticatedChecker.authenticatedChecker,async (req,res)=>{
    const id = req.params.id

     postModel.findOne({_id:id}).populate('comments').then((post)=>{
      
        const comments_array = post.comments

        if (!post.comments.length < 1) {
            
        }
        comments_array.forEach(comment => {
            comment.remove()
        });


          //Removing the uploaded file
    fs.unlink(uploads_dir+post.file,(err)=>{
        post.remove()
         res.redirect('/admin/posts')
    })




     })
  
  



    
})



module.exports = router