const router = require('express').Router();
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const { registerValidation , loginValidation } = require('../helper/validation')
const verifyToken = require('../helper/verifyToken')

router.post('/register', verifyToken,async (req,res) => {
    // Validate
    const { error } = registerValidation(req.body)
    if ( error ) return res.status(400).send({ 'message' : error.details[0].message })

    // Email exist
    const emailExist = await User.findOne({ email: req.body.email })
    if(emailExist) return res.status(200).send({ 'message' : "Email already exist" })

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    try{
        const saveUser = await user.save()
        res.send(saveUser)
    }catch(err){
        res.status(400).send(err)
    }
})

router.post('/login', async (req,res) => {
    const { error } = loginValidation(req.body)
    if ( error ) return res.status(400).send({ 'message' : error.details[0].message })

    // Email exist
    const user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(200).send({ 'message' : "User not exist" })

    // Password Check
    const validatePassword = await req.body.password.localeCompare(user.password)
    if(validatePassword !== 0) return res.status(400).send({ 'message' : "Invalid password" })

    const token = jwt.sign({_id : user._id , email : user.email} , process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({
        'message' : "Login Successfull",
        'token' : token
    })
})


module.exports = router