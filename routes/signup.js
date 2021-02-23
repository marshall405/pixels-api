var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const bson = require('bson')
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_URI

router.post('/', async function(req, res, next) {
  const {first_name, last_name, email, password} = req.body
  
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }) 

  let user;

  try {
    await client.connect()
    let users = await client.db("Canvas").collection("users")
    user = await users.insertOne({
        first_name, last_name, email, password, projects : []
    })
  } catch(err) {
    console.log('Error inside signup.js', err)
  }
  
  // user = {
  //   first_name : 'Marshall',
  //   last_name : 'Slemp',
  //   email : 'marshall.slemp@gmail.com',
  //   password: '1234',
  //   id: 1,
  //   projects: [
  //     { _id: '346376544', title: 'First Canvas Project'},
  //     { _id: '463543456', title: 'Second Canvas Project'},
  //     { _id: '845346423', title: 'Third Canvas Project'},
  //     { _id: '693893486', title: 'Fourth Canvas Project'},
  //   ]
  // }

  if(user){
    let token = jwt.sign({user_id: user.ops[0]._id}, JWT_SECRET)
    const {first_name, last_name, email, projects} = user.ops[0]
    res.json({
    user: {
        first_name, last_name, email, projects }, 
        jwt: token
    })
  } else {
    res.json({error: user})
  }
    
});

module.exports = router;