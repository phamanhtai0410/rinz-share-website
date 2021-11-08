var express = require('express');
var request = require('request');
var router = express.Router();


const { IAPI, FIREBASE_KEY, DOMAIN } = require('../config');
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
  // console.log('URL: ', req.url, Date.now());
  next();
});


const get_artist_detail = id =>
  new Promise(async (resolve, reject) => {
    var options = {
      method: 'GET',
      url: IAPI + `/v1/core-api/api/artist/${id}`,
      headers: {}
    };
    await request(options, function(error, response) {
      if (error) {
        reject();
      }
      let response_json = JSON.parse(response.body);
      console.log(response_json.status);
      if (response_json.status === 1) {
        resolve(response_json.data);
      }
      resolve({});
    });
  });



/////
// define the home page route


////
//    Artist Share
////

router.get('/artist/:artist_id', async (req, res) => {
  const { artist_id } = req.params;
  // const id = artist_id.split('-')[0];
  const detail = await get_artist_detail(artist_id);
  const dynamic_link_json = await get_dyanmic_link(`/artist/${artist_id}`);
  console.log(detail);
  res.render('share/artist/index', {
    detail: detail,
    type: 'artist',
    id: detail.id,
    dynamic_link: dynamic_link_json.shortLink
  });
});





////  End of definations

module.exports = router;
