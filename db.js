const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_URI
const bson = require('bson')
let client;


async function save(values){
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }) 
    try {
      await client.connect()
      let pixels = await client.db("Canvas").collection("pixels")
      await pixels.updateOne({name:"root"}, {
        $push: {
          values: values
        }
      })
    } finally {
      await client.close()
    }
  }

async function getPixels(id) {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }) 
    try {
      await client.connect()
      let pixels = await client.db("Canvas").collection("pixels")
      let result = await pixels.findOne({_id: bson.ObjectId(id)})
      return result.values
    } catch(err) {
      console.log(err)
    } finally {
      await client.close()
    }
}

async function savePixels(id, values) {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }) 
    try {
      await client.connect()
      let pixels = await client.db("Canvas").collection("pixels")
      await pixels.updateOne({_id: bson.ObjectId(id)}, {
        $push: {
          values: {
            $each: values
          }
        }
      })
    } finally {
      await client.close()
    }
}

module.exports = {
    save, getPixels, savePixels
}