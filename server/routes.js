const express = require('express');
const router = express.Router(); 
const bdd = require('./db.js');


router.get('/products/search', async (req, res)=>{

    let brand = req.query.brand?{brand:req.query.brand}:{}
    let limit = parseInt(req.query.limit)?parseInt(req.query.limit):12
    let price = parseFloat(req.query.price)?{price:parseFloat(req.query.price)}:{}

    let p = await bdd.getFilteredProduct(limit, brand, price)

    res.send({
        limit,
        brand:brand.brand,
        price:price.price,
        results:p

    })
})



router.get('/products/:id',  async (req, res)=>{
    res.send(await bdd.getProductById(req.params.id))

})


module.exports = router; 