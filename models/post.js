const mongoose = require('mongoose')
const URLSlugs = require('mongoose-url-slugs');
const postScehma = new mongoose.Schema({
   
    title: {
        type: String,
       
    },
    status: {
        default: 'public',
        type: String,
      
    },
    allowComments: {
        type: Boolean,
        
    
    },
    body: {
        type: String,
     
    },
    slug:{
        type: String
    },
    category: {
        type: String
    },
    file:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now()
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment'
    }]



},{
    usePushEach: true
})
mongoose.plugin(URLSlugs('title',{field:'slug'}))

module.exports = mongoose.model('post',postScehma)