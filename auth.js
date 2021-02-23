const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const bson = require('bson')
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_URI

let User = require('./models/User')

async function auth(req, res, next) {

  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }) 

  try {
    await client.connect()
    let users = await client.db("Canvas").collection("users")
    if(req.headers.authorization){
      let decoded = jwt.decode(req.headers.authorization, JWT_SECRET)
      user = await users.findOne({"_id": bson.ObjectId(decoded.user_id)})
      req.user = new User(user)
      next()
    } else {
      res.status(400)
      res.send('Unauthorized')
    }
  } catch(err) {
    console.log('Another Error: ', err)
  }
  client.close()
}

module.exports = auth;