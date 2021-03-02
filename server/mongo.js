
const {MongoClient} = require('mongodb');
const scrap = require("./scrap/index")
require('dotenv').config();


const connect = async (MONGODB_DB_NAME)=>{
    const MONGODB_URI = `mongodb+srv://dbUser:${process.env.dbMdp}@cluster0.cq1hp.mongodb.net/${MONGODB_DB_NAME}?retryWrites=true&w=majority`;
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true, 'useUnifiedTopology': true});
    const db =  client.db(MONGODB_DB_NAME)
    return db
}

const insert = (db, name, data)=>{
    const collection = db.collection(name);
    const result = collection.insertMany(data);
    return result
}

// some query
const getbrandProduct = async (db, brand)=>{
    const collection = db.collection('products');
    const res = await collection.find({brand:brand}).toArray();;
    console.log(res)
}

const lessThanPrice = async (db, price)=>{
    const collection = db.collection('products');
    const res = await collection.find({brand}).toArray();;
    console.log(res)
}

const sortedByprice = async (db)=>{
    const collection = db.collection('products');
    const res = await collection.find({brand}).toArray();;
    console.log(res)
}



const run = async()=>{
    let MONGODB_DB_NAME = 'clearfashion'
    let db = await connect(MONGODB_DB_NAME)
    let products = await scrap()
    await insert(db, 'products', products)

    getbrandProduct(db, 'ADRESSE Paris')
}

run()