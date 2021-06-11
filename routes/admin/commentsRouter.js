const express = require('express')
const router = express.Router()
const {authenticatedChecker} = require('../../helpers/authenticatedChecker.js')
const {getComments,createComments,deleteComments} = require('../../controllers/admin/commentsController')



//Comment fetch and create route
router.route('/')
.get(authenticatedChecker,getComments)
.post(authenticatedChecker,createComments)
//Comment Delete Route
router.route('/:id')
.delete(authenticatedChecker,deleteComments)


module.exports = router