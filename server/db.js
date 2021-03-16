const {MongoClient} = require('mongodb');
const start = require('./scrap/index.js');
require('dotenv').config();
const scrapp = require("./scrap/index.js")

let client = null;
let db = null;

const connect = async ()=>{
    if(!db){
        const MONGODB_URI = `mongodb+srv://dbUser:${process.env.dbMdp}@cluster0.cq1hp.mongodb.net/$clearfashion?retryWrites=true&w=majority`;
        client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true, 'useUnifiedTopology': true});
        db = client.db("clearfashion")
    }
}
const insert = async (name, data)=>{
    await connect();
    try{
        const collection = db.collection(name);
        const result = await collection.insertMany(data, {'ordered': false});
        console.log(`${result.insertedCount} products inserted`)
    } catch (error) {
        console.log(`${error.result.nInserted} products inserted`);
      }
    
}
const scrap_insert = async () =>{
    await connect();
    let data = await start();
    await insert('products', data);
    close();
}
const close = () => client.close()


// some needed queries

const getProductById = async (id)=>{
    await connect();
    const collection = db.collection('products');
    const res = await collection.find({_id:id}).toArray();
    return res
}
const getFilteredProduct = async (limit, brand, price, categorie)=>{
    limit = limit<0?0:limit;
    await connect();
    const selector = Object.assign( {}, brand, price, categorie);
    const collection = db.collection('products');
    const n = await collection.countDocuments(selector);
    const res = await collection.find(selector).limit(limit).toArray();
    return {res, n}
}


// some other queries
const getbrandProduct = async (brand)=>{
    await connect();
    const collection = db.collection('products');
    const res = await collection.find({brand:brand}).toArray();;
    return res
}
const lessThanPrice = async (price)=>{
    await connect();
    const collection = db.collection('products');
    const res = await collection.find({"price":{$lte:price}}).toArray();;
    return res
}
const sortedByprice = async ()=>{
    await connect();
    const collection = db.collection('products');
    const res = await collection.find().sort({"price":-1}).toArray();;
    return res
}

//scrap_insert();

module.exports = {connect, insert, close, getProductById, getFilteredProduct}
