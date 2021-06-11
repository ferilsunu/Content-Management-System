const mongoose = require('mongoose')
const commentsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    body: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now()
    }
})



const comments_model = mongoose.model('comment',commentsSchema)
module.exports = comments_model