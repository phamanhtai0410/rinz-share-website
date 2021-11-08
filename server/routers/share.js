var express = require('express');
var request = require('request');
var router = express.Router();
const { IAPI, FIREBASE_KEY, DOMAIN } = require('../config');
const fetch = require('../utils/_fetching');
const log_st = require('../utils/_debug_log');


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


const get_track_detail = id => 
  new Promise(async (resolve, reject) => {
    var options = {
      method: 'GET',
      url: IAPI + `/v1/core-api/api/track/${id}`,
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

const get_event_detail = id => 
  new Promise(async (resolve, reject) => {
    var options = {
      method: 'GET',
      url: IAPI + `/v1/core-api/api/event/${id}`,
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


const get_dyanmic_link = link => 
  new Promise(async (resolve, reject) => {
    var options = {
      method: 'POST',
      url: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${FIREBASE_KEY}`,
      headers: {
        "content-type": "application/json",
      },
      json: {
        "dynamicLinkInfo": {
          "domainUriPrefix": "https://rinzworld.page.link",
          "link": DOMAIN + `${link}`,
          "androidInfo": {
            "androidPackageName": "com.esol.rinzworld"
          },
          "iosInfo": {
            "iosBundleId": "com.esol.RinZWorld"
          }
        }
      }
    };

    await request(options, function(error, response) {
      if (error) {
        reject();
      }
  
      let response_json = response.body;
      // JSON.parse(response.body);
      // console.log('Body: ', response_json.shortLink);
      if (response_json) {
        resolve(response_json);
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

////
//    Track Share
////
router.get('/track/:track_id', async (req, res) => {
  const { track_id } = req.params;
  // const id = artist_id.split('-')[0];
  const detail = await get_track_detail(track_id);
  console.log(detail);
  const dynamic_link_json = await get_dyanmic_link(`/track/${track_id}`);
  console.log('- Track dynamic link: ', dynamic_link_json);
  console.log('- Track detail: ', detail);

  res.render('share/track/index', {
    detail: detail,
    type: 'track',
    id: detail.id,
    dynamic_link: dynamic_link_json.shortLink
  });
});

/////
/// Test route
//
router.get('/test/:track_id', async (req, res) => {
  const { track_id } = req.params;
  const dynamic_link_json = await get_dyanmic_link(`/track/${track_id}`);
  console.log('dynamic link: ', dynamic_link_json);
});

////
//    Stream Key Site
////
router.get('/event/:event_id/key', async (req, res) => {
  const { event_id } = req.params;
  console.log('URL params query = ', req.query);
  const server = req.query.server;
  const key = req.query.key;
  const username = req.query.username;
  const password = req.query.password;

  // const id = artist_id.split('-')[0];
  const detail = await get_event_detail(event_id);
  console.log(detail);
  res.render('stream_key/index', {
    detail: detail,
    type: 'event',
    id: detail.id,
    server: server,
    key: key,
    username: username,
    password: password
  });
});

////
//  Event Share
////
router.get('/event/:event_id', async (req, res) => {
  const { event_id } = req.params;
  // const id = artist_id.split('-')[0];
  const detail = await get_event_detail(event_id);
  const dynamic_link_json = await get_dyanmic_link(`/event/${event_id}`);
  console.log(detail);
  res.render('share/event/index', {
    detail: detail,
    type: 'event',
    id: detail.id,
    dynamic_link: dynamic_link_json.shortLink
  });
});


//////////////////////////////////////////////////
//  Feed Share                               ////
//////////////////////////////////////////////////

router.get('/feed/:feed_id', async(req, res) => {
  const { feed_id } = req.params;
  const feed_info = await fetch(IAPI + `/v1/core-api/api/tweet/${feed_id}`, 'GET', {});
  const dynamic_link_json = await get_dyanmic_link(`/tweet/${feed_id}`);
  res.render('share/feed/index', {
    detail: feed_info.data,
    type: 'tweet',
    id: feed_info.data.id,
    dynamic_link: dynamic_link_json.shortLink
  });
});




////  End of definations

module.exports = router;
