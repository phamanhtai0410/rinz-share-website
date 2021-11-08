var express = require('express');
var request = require('request');
var router = express.Router();
const { IAPI } = require('../config');
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  var now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth() < 9 ? "0" + now.getMonth() : now.getMonth() + 1;
  var d = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
  var h = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
  var min = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
  var sec = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds()

  console.log(`***  ${y} ${d}THG${m} ${h}:${min}:${sec}  URL - ${req.url}`);
  next();
});


const get_something = id => {
    //Do some thing
}

/////
// Define the route
////

router.get('/', async (req, res) => {
  res.render('upload/index', {
  });
});

router.post('/post-file', async (req, res) => {
  console.log(req.files)
  try {
    if(!req.files) {
        res.send({
            status: false,
            message: 'No file uploaded'
        });
    } else {
        // use the name of the input field (i.e. "avatar") 
        // to retrieve the uploaded file
        let file = req.files.file1;
        
        // use the mv() method to place the file in 
        // upload directory (i.e. "uploads")
        file.mv('./uploads/' + file.name);

        //send response
        res.send({
            status: true,
            message: 'File is uploaded'
        });
    }
  } catch (err) {
    res.status(500)
  }
});


  module.exports = router;

  