// require('../db.js')

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_URI
const bson = require('bson')

class User {
    constructor({_id}){
        this._id = _id
    }
    get_name() {
        return "Marshall"
    }

    async addProject(name){
        let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }) 
        let project;
        try {
            await client.connect()
            project = await client.db("Canvas").collection('pixels').insertOne({
                name: name,
                values: []
            })
            let users = await client.db("Canvas").collection("users").updateOne({
                _id: bson.ObjectId(this._id)
            },{
              $push: {
                projects: {
                    name: name,
                    _id: project.insertedId
                } 
              }
            })
          } catch(err) {
              console.log(err)
              return false
          } finally {
            await client.close()
            return project.ops[0]
          }
    }
}

module.exports = User