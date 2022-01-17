const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    customerId : { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    name : {
        type : String,
        require : true,
        min : 5,
        max : 50
    },
    contact : {
        type : String
    }, 
    email : {
        type : String,
        require : true,
        unique : true,
        min : 5,
        max : 50
    },  
    createdDate : {
        type : Date,
        default : Date.now
    }
})
module.exports = mongoose.model('Customer', customerSchema);