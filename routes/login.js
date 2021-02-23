var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const bson = require('bson')
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_URI

router.post('/', async function(req, res, next) {
  const {email, password} = req.body
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: false }) 

  let user;

  try {
    await client.connect()
    let users = await client.db("Canvas").collection("users")
    if(req.headers.authorization){
      let decoded = jwt.decode(req.headers.authorization, JWT_SECRET)
      user = await users.findOne({"_id": bson.ObjectId(decoded.user_id)})
      const {first_name, last_name, email, projects} = user
      res.json({
        user: {
          first_name, last_name, email, projects}
        })
        return
    } else {
      user = await users.findOne({
        email
      })
    }
  } catch(err) {
    console.log('Error inside Login.js', err)
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
    if(user.password === password){
      let token = jwt.sign({user_id: user._id}, JWT_SECRET)
      const {first_name, last_name, email, projects} = user
      res.json({
        user: {
          first_name, last_name, email, projects}, jwt: token
        })
      }else {
        res.json({error: 'Password is incorrect!'})
      }
  } else {
    res.json({error: 'Email does not exist!'})
  }
    
});

module.exports = router;






