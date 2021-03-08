const {MongoClient} = require('mongodb');
const scrap = require("./scrap/index")
require('dotenv').config();

let client = null;
let db = null;

const connect = async (MONGODB_DB_NAME)=>{
    const MONGODB_URI = `mongodb+srv://dbUser:${process.env.dbMdp}@cluster0.cq1hp.mongodb.net/${MONGODB_DB_NAME}?retryWrites=true&w=majority`;
    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true, 'useUnifiedTopology': true});
    db = client.db(MONGODB_DB_NAME)
}

const insert = async (name, data)=>{
    try{
        const collection = db.collection(name);
        const result = await collection.insertMany(data, {'ordered': false});
        console.log(`${result.insertedCount} products inserted`)
    } catch (error) {
        console.log(`${error.result.nInserted} products inserted`);
      }
    
}

// some query
const getbrandProduct = async (brand)=>{
    const collection = db.collection('products');
    const res = await collection.find({brand:brand}).toArray();;
    console.log(res)
}

const lessThanPrice = async (price)=>{
    const collection = db.collection('products');
    const res = await collection.find({"price":{$lte:price}}).toArray();;
    console.log(res)
}

const sortedByprice = async ()=>{
    const collection = db.collection('products');
    const res = await collection.find().sort({"price":-1}).toArray();;
    console.log(res)
}



const run = async()=>{
    await connect('clearfashion')
    let products = await scrap()
    await insert('products', products)

    //await getbrandProduct('ADRESSE Paris')
    await lessThanPrice(40)
    //await sortedByprice()

    client.close()
}

run()