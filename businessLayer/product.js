var asyncronize = require('async');
const Product = require("../model/Products");

const insertProduct = (products) => {
    asyncronize.each(products,(product, callback) => {
        Product.findOneAndUpdate({ productCode : product.productCode }, product, { upsert : true },(err, doc) => {
            if(err){
             return callback(err);
            }
            return callback();
        });
    }, function(err){
        if(err){
            console.log("Error",err);
        }
        else{
            console.log("Inserted")
        }
    })
}

module.exports ={
    insertProduct
}