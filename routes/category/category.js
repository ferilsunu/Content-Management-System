const express = require('express')
const { findByIdAndDelete } = require('../../models/category')
const router = express.Router()
const categoryModel = require('../../models/category')
const authenticatedChecker = require('../../helpers/authenticatedChecker.js')


router.get('/' ,authenticatedChecker.authenticatedChecker, async (req , res)=>{
    const fetched_category = await categoryModel.find({}).lean()
   res.render('admin/category/index',{
       category: fetched_category
   })

})

router.post('/createCategory',authenticatedChecker.authenticatedChecker,async (req,res)=>{
    await new categoryModel({name:req.body.category_name}).save()
    req.flash('success_message','Category created')
    res.redirect('/admin/category')
})
router.get('/edit/:id',async (req,res)=>{
    const fetched_category2 = await categoryModel.findOne({_id: req.params.id}).lean()
    console.log(fetched_category2)
    res.render('admin/category/editCategory',{
        fetched_category: fetched_category2
    })
})

router.put('/edit/:id',authenticatedChecker.authenticatedChecker, async (req,res)=>{
    await categoryModel.findByIdAndUpdate(req.params.id,{name:req.body.category_name})
    req.flash('success_message','Category Updated')
    res.redirect('/admin/category')
} )

router.delete('/delete/:id',authenticatedChecker.authenticatedChecker,async (req,res)=>{
    await categoryModel.findByIdAndDelete({_id:req.params.id })
    req.flash('delete-message',"Category was deleted successfully")
    res.redirect('/admin/category')
})




module.exports = router