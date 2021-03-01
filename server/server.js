
const { MongoClient } = require("mongodb");
const scrap = require("./sandbox")
require('dotenv').config();


const connect = async (MONGODB_DB_NAME)=>{
    const MONGODB_URI = `mongodb+srv://victorgoubet:${process.env.MDP}@clearfashion.v8kin.mongodb.net/database?retryWrites=true&w=majority`;
    console.log(MONGODB_URI)
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true, 'useUnifiedTopology': true});
    const db =  client.db(MONGODB_DB_NAME);
    return db
}

const insert = (db, name, data)=>{
    const collection = db.collection(name);
    const result = collection.insertMany(data);
    return result
}

const db = connect('clearfashion')

/*
let products = scrap()
insert(db, 'products', products)
*/


// some query
const getbrandProduct = (brand)=>{
    const collection = db.collection('products');
    const products = await collection.find({brand}).toArray();;
    return products
}

const lessThanPrice = (price)=>{
    const collection = db.collection('products');
    const products = await collection.find({brand}).toArray();;
    return products
}

const sortedByprice = ()=>{
    const collection = db.collection('products');
    const products = await collection.find({brand}).toArray();;
    return products
}



