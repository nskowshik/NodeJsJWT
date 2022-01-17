const router = require("express").Router();
const { insertProduct } = require('../businessLayer/product')
const Product = require("../model/Products");
const verifyToken = require('../helper/verifyToken');
const multer = require('multer')
const fs = require('fs');
const XLSX = require('xlsx');
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const csvj =require('csvtojson')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __basePath + '/.temp/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const uploadFile = multer({ storage: storage })

router.get("/",verifyToken, (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then(docs => {
      const response = {
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => { res.status(500).json({ error : err }); });
});

router.post('/', uploadFile.single('product'), async (req , res) => {
  try{
      const reqFile = req.file; 
      let filePath = __basePath + '/.temp/' + reqFile.originalname

      if(filePath.match(/\.([^\.]+)$/)[1].includes('xls')){
          const workBook = XLSX.readFile(filePath);
          XLSX.writeFile(workBook, filePath, { bookType: "csv" });
      }

      let csvData=[]
      csvj({
        noheader: false,
        headers: ['productCode','name','price']
      })
      .fromFile(filePath)
      .then((jsonObj)=>{
          csvData.push(...jsonObj); 
      }).catch(err => console.error(err))
      .finally(async () => { 
          await unlinkAsync(req.file.path)
          await insertProduct(csvData)
          res.status(200).send({
            message : "All products are upserted!"
          })
      })

  } catch (err) {
      console.error(`Error while storing products`, err.message);
      next(err);
  }

})
module.exports = router;