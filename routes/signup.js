var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');
const saltrounds = 10;

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const bson = require('bson');
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_URI;

router.post('/', async function(req, res, next) {
  const {first_name, last_name, email, password} = req.body;
  
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    let users = await client.db("Canvas").collection("users");

    // check if user already exists with email
    let userExists = await users.findOne({"email" : email});
    if(userExists) return res.json({error: `${email} is already in use.`});


    // no user exists
    await bcrypt.hash(password, saltrounds, async function(err, hash) {
      let user = await users.insertOne({
        first_name, last_name, email, hash, projects : []
      });

      if(user){
        let token = jwt.sign({user_id: user.ops[0]._id}, JWT_SECRET);
        const {first_name, last_name, email, projects} = user.ops[0];
        res.json({
        user: {
            first_name, last_name, email, projects }, 
            jwt: token
        });
      } else {
        res.json({error: user});
      }

    });
    
  } catch(err) {
    console.log('Error inside signup.js', err);
  }
});

module.exports = router;