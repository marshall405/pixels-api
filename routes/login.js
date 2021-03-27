var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const saltrounds = 10;
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const bson = require('bson')
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_URI

router.post('/', async function(req, res, next) {
  const {email, password} = req.body
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: false }) 

  
  try {
    let user;
    await client.connect()
    let users = await client.db("Canvas").collection("users")

    if(req.headers.authorization){
      let decoded = jwt.decode(req.headers.authorization, JWT_SECRET)
      user = await users.findOne({"_id": bson.ObjectId(decoded.user_id)})
      const {first_name, last_name, email, projects} = user
      return res.json({
        user: {
          first_name, last_name, email, projects}
        })
    } else {
      user = await users.findOne({
        email
      });
    }

    if(user){
      await bcrypt.compare(password, user.hash, function(err, result){
        if(result){
          let token = jwt.sign({user_id: user._id}, JWT_SECRET)
          const {first_name, last_name, email, projects} = user
          res.json({
            user: {
              first_name, last_name, email, projects}, jwt: token
            })
        }else {
          res.json({error: 'Password is incorrect!'})
        }
      })
    } else {
      res.json({error: 'Email does not exist!'})
    } 
  } catch(err) {
    console.log('Error inside Login.js', err)
  }
});

module.exports = router;






