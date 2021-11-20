
const postModel = require('../../models/post.js')
let filename = ''
module.exports = {
    fetchPosts: (req,res)=>{
        postModel.find().lean().then((data) => {
            res.render('admin/posts/index', {
                data: data
            })
      })
    },
    createPostPage:  async (req, res) => {
        const cats = await categoryModel.find({}).lean()
        res.render('admin/posts/createPost', {
            category: cats
        })
    
    },

    createPost: async (req, res) => {


        if (!isEmpty(req.files)) {
            const files = req.files.uploadedFile
            filename = Date.now() + '-' + files.name
            files.mv('./public/uploads/' + filename, (err) => {
                if (err) {
                    return err
                }
    
            })
        }
    
        let allowComments = true
        if (req.body.allowComments) {
            allowComments = 'true'
        } else {
            allowComments = 'false'
        }

        await postModel({
            title: req.body.title,
            body: req.body.body,
            status: req.body.status,
            allowComments: allowComments,
            file: filename,
            category: req.body.category
        }).save()
        req.flash('success_message', 'Post was created succesfully')
        res.redirect('/admin/posts')
    
    }
}