require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_URI
let client;


async function save(values){
    client = new MongoClient(uri, { useNewUrlParser: true })  
    let pixels = await client.db("Canvas").collection("pixels")
    await pixels.updateOne({name:"root"}, {
      $push: {
        values: values
      }
    })
    await client.close()
  }

async function getPixels() {
    client = new MongoClient(uri, { useNewUrlParser: true })  
    await client.connect()
    let pixels = await client.db("Canvas").collection("pixels")
    let results = await pixels.findOne({name:"root"})
    await client.close()
    return results.values
}

module.exports = {
    client, save, getPixels
}