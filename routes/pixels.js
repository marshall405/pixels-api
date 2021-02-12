var express = require('express');
var router = express.Router();

const {getPixels} = require('../db')
/* GET pixels */

router.get('/', async function(req, res, next) {
  let results = await getPixels()
  res.send(JSON.stringify(results))
});

module.exports = router;