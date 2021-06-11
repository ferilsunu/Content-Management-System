const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password:  {
        type: String
    },
    email:  {
        type: String
    }
})

user_model = mongoose.model('user',userSchema)
module.exports = user_model