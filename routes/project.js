var express = require('express');
var router = express.Router();

// add new project to user
router.post('/', async function(req,res,next) {

    let result = await req.user.addProject(req.body.projectName)    
    console.log(result)
    res.json(result)
})
  
  
  module.exports = router;