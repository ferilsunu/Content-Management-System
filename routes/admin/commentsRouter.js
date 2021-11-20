const express = require('express')
const router = express.Router()
const {authenticatedChecker} = require('../../helpers/authenticatedChecker.js')
const {getComments,createComments,deleteComments} = require('../../controllers/admin/commentsController')




router.route('/')
.get(authenticatedChecker,getComments)
.post(authenticatedChecker,createComments)


router.route('/:id')
.delete(authenticatedChecker,deleteComments)


module.exports = router