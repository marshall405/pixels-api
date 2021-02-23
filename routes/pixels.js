var express = require('express');
var router = express.Router();

const {getPixels, savePixels} = require('../db')

/* GET pixels */

router.get('/', async function(req, res, next) {
  let id = req.query.id
  if(id){
    let results = await getPixels(id).catch(err => console.log(err))
    res.json(results)
  } else {
    res.json({error: 'Could not find Project'})
  }
});

router.post('/', async function(req,res,next) {
  await savePixels(req.body._id, req.body.pixels )
  res.json({message : 'saved'})
})


module.exports = router;