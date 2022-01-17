const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true,
        min :5
    },
    email : {
        type : String,
        require : true,
        unique : true,
        min : 8,
        max : 255
    },
    password : {
        type : String,
        require : true,
        min : 5,
        max : 255
    },
    createdDate : {
        type : Date,
        default : Date.now
    }
})
module.exports = mongoose.model('User', userSchema);