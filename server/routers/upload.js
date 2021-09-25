var express = require('express');
var request = require('request');
var router = express.Router();
const { IAPI } = require('../config');
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('URL: ', req.url, Date.now());
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

  