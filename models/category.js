const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
    name: {
        type: String
    }
})



const category_model = mongoose.model('category',categorySchema)
module.exports = category_model