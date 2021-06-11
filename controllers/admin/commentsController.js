const commentsModel = require('../../models/comments')
const postModel = require('../../models/post')
module.exports = {
  getComments:  (req,res)=>{
     commentsModel.find({user: req.user._id}).lean().populate('user').then((comments)=>{
        res.render('admin/comments/commentsIndex',{comments: comments})

     })
 
} ,
createComments: async (req,res)=>{

    postModel.findOne({_id: req.body.post_id}).then((post)=>{

        const new_comment =  new commentsModel({body:req.body.comment_body,user:req.user._id})
        
         post.comments.push(new_comment)

        post.save().then((savedPost)=>{
            new_comment.save().then((savedCommment)=>{
                    res.redirect(`/post/${post._id}`)
            })
        })



    })

    

     
   
    
},

deleteComments: async (req,res)=>{
    await commentsModel.findById({_id:req.params.id}).remove()
    await postModel.findOneAndUpdate({_id:req.params._id},{$pull:{comments:req.params.id}},(err,data)=>{
        if (err) {
            return err
        }
    })
    res.redirect('/admin/comments')
}
}