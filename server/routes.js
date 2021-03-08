const express = require('express');
const router = express.Router(); 
const bdd = require('./db.js');



router.get('/products/:id',  async (req, res)=>{
    res.send(await bdd.getProductById(req.params.id))

})

module.exports = router; 