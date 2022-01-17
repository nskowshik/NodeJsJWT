const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerId : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Customer' 
    },
    product : { 
        type: Array, 
        ref: 'Product', 
        required: true 
    },
    qty : { 
        type : Number, 
        default: 1
    },
    orderNumber : {
        type : String,
        require : true,
        unique : true,
        min : 5,
        max : 50
    },
    email:{
        type : String,
        require : true,
        min : 5,
        max : 50
    },
    paymentAmount : {
        type : String,
        require : true
    },
    createdDate : {
        type : Date,
        default : Date.now
    }
})
module.exports = mongoose.model('Order', orderSchema);