const mongoose = require('mongoose')
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

module.exports = mongoose.model('post',postScehma)