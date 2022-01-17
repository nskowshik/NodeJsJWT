const router = require('express').Router();
const Customer = require('../model/Customer')
const User = require('../model/User')
const Order = require('../model/Order')
const { validateCustomer } = require('../helper/validation')
const verifyToken = require('../helper/verifyToken')

router.post('/register', verifyToken,async (req,res) => {
    // Validate
    const { error } = validateCustomer(req.body)
    if ( error ) return res.status(400).send({ 'message' : error.details[0].message })

    // Email exist
    const emailExist = await Customer.findOne({ email: req.body.email })
    if(emailExist) return res.status(200).send({ 'message' : "Customer Detail already exist" })

    // Check if User exist
    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(200).send({ 'message' : "User not exist,Kindly register user" })

    const customer = new Customer({
        customerId : user._id,
        name : req.body.name,
        contact : req.body.contact,
        email : req.body.email
    })
    try{
        const saveCustomer = await customer.save()
        res.send(saveCustomer)
    }catch(err){
        res.status(400).send(err)
    }
})

router.post('/getcustomerproducts' , verifyToken ,async (req, res) => {
    const user = await Customer.findOne({ email: req.body.email })
    if(!user) return res.status(200).send({ 'message' : "User not exist,Kindly register user" })
    
    Order.find( { customerId : user._id } ).sort([[ `${Object.keys(req.body.sort)[0]}`, `${Object.values(req.body.sort)[0]}`]])
    .select("_id product orderNumber paymentAmount")
    .exec()
    .then(orders => { 
        res.status(200).send({ 'result' : orders})
    }).catch(err => { res.status(500).json({ error: err }) })
    
})

router.post('/getproductcount' , verifyToken ,async (req, res) => {
    const user = await Customer.findOne({ email: req.body.email })
    if(!user) return res.status(200).send({ 'message' : "User not exist,Kindly register user" })
    
    Order.aggregate(
        [
            {
              $group: {
                _id: "$customerId",
                total : {
                    $sum : "$qty"
                }
              }
            }
        ]
    )
    .then(async (orders) => { 
        let response = []
        for(let order of orders){ 
            await Customer.findOne({ _id : order._id }).select("_id name email").then( user => {
                response.push({ 
                    "user" : user, 
                    "total" : order.total
                })
            })
        }
        res.status(200).send({ 'result' : response})
    }).catch(err => { res.status(500).json({ error: err }) })
    
})

module.exports = router