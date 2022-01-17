const router = require('express').Router();
const Order = require('../model/Order')
const Product = require('../model/Products')
const Customer = require('../model/Customer')
const verifyToken = require('../helper/verifyToken')

router.post('/createorder', verifyToken,async (req,res) => {
    // Validate
    const user = await Customer.findOne({ email: req.body.email })
    if(!user) return res.status(200).send({ 'message' : "User not exist,Kindly register user" })

    Product.findById(req.body.productId)
    .then(product => {
        if (!product) return res.status(404).json({ message: "Product not found" })
        const date =new Date()
        const order = new Order({
            customerId : user._id,
            email : user._email,
            paymentAmount : req.body.paymentAmount,
            qty: req.body.qty,
            product: [product],
            orderNumber : `Order-${date.getFullYear().toString()}${(date.getMonth() + 101).toString().substring(1)}${(date.getDate() + 100).toString().substring(1)}${date.getTime()}`
        });
        return order.save();
    })
    .then(result => { res.status(200).json({
        message: "Order stored",
        createdOrder:  result
    });
    })
    .catch(err => { res.status(500).json({ error: err }) });
})

router.patch('/updateorder', verifyToken,async (req,res) => {

    // Email exist
    const user = await Customer.findOne({ email: req.body.email })
    if(!user) return res.status(200).send({ 'message' : "User not exist,Kindly register user" })
    
    Order.findOne({ orderNumber : req.body.orderNumber }).then((order) => {
        Product.findById(req.body.productId)
        .then(product => {
            if (!product) return res.status(404).json({ message: "Product not found" })
            order.customerId = user._id,
            order.email = user._email,
            order.paymentAmount = req.body.paymentAmount,
            order.qty= req.body.qty,
            order.product= [product],
            order.orderNumber = req.body.orderNumber
            return order.save();
        })
        .then(result => { res.status(200).json({
            message: "Order stored",
            createdOrder:  result
        });
        })
        .catch(err => { res.status(500).json({ error: err }) });
    })
    .catch(err => { res.status(500).json({ error: err }) });

})

router.delete('/deleteorder', verifyToken,async (req,res) => {
    // Validate
    const user = await Customer.findOne({ email: req.body.email })
    if(!user) return res.status(200).send({ 'message' : "User not exist,Kindly register user" })
    
    Order.findByIdAndDelete(req.body._id).then((order) => { 
        res.send({success: 'Order deleted successfully'})
    })
    .catch(err => { res.status(500).json({ error: err }) });
})
module.exports = router