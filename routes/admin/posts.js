const express = require('express')
const app = express()
const router = express.Router()
const categoryModel = require('../../models/category.js')
const {
    isEmpty
} = require('../../helpers/upload-helpers.js')
const fs = require('fs')
const path = require('path')
const uploads_dir = path.join(__dirname, '../../public/uploads/')
const {authenticatedChecker} = require('../../helpers/authenticatedChecker.js')

const {fetchPosts,createPostPage,createPost} = require('../../controllers/admin/postController')


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin'
    next()
})



router.route("/")
.get(authenticatedChecker,fetchPosts)


router
.route('/createPost')
.get(authenticatedChecker,createPost)
.post(authenticatedChecker,createPost )



router.get('/edit/:id', (req, res) => {
    const id = req.params.id
    postModel.findById(id).lean().then(async (post) => {
        //About Lean: https://kb.objectrocket.com/mongo-db/how-to-use-mongoose-lean-926
        //Lean Just increases the speed of the process! It somehow fixes the problem with the express-handlebras as well
        const fetched_category = await categoryModel.find({}).lean()

        res.render('admin/posts/editPosts', {
            post: post,
            cat: fetched_category
        })
    })


})

router.put('/edit/:id', authenticatedChecker.authenticatedChecker, async (req, res) => {
    let allowComments = true
    if (allowComments) {
        allowComments = true
    } else {
        allowComments = false
    }
    const id = req.params.id


    if (!isEmpty(req.files)) {
        const files = req.files.uploadedFile
        filename = Date.now() + '-' + files.name
        files.mv('./public/uploads/' + filename, (err) => {
            if (err) {
                return err
            }

        })
    }

    await postModel.findOneAndUpdate(id, {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        file: filename
    })
    req.flash('success_message', 'Post was edited sucessfully')
    res.redirect('/admin/posts')
})


router.delete('/delete/:id', authenticatedChecker.authenticatedChecker, async (req, res) => {
    const id = req.params.id

    postModel.findOne({
        _id: id
    }).populate('comments').then((post) => {

        const comments_array = post.comments

        if (!post.comments.length < 1) {

        }
        comments_array.forEach(comment => {
            comment.remove()
        });


        //Removing the uploaded file
        fs.unlink(uploads_dir + post.file, (err) => {
            post.remove()
            res.redirect('/admin/posts')
        })




    })






})



module.exports = router