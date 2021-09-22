var express = require('express');
var request = require('request');
var router = express.Router();
const { IAPI } = require('../config');
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('URL: ', req.url, Date.now());
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



/////
// define the home page route



router.get('/artist/:artist_id', async (req, res) => {
  const { artist_id } = req.params;
  // const id = artist_id.split('-')[0];
  const detail = await get_artist_detail(artist_id);
  console.log(detail);
  res.render('artist/index', {
    detail: detail,
    type: 'artist',
    id: detail.id
  });
});


router.get('/track/:track_id', async (req, res) => {
  const { track_id } = req.params;
  // const id = artist_id.split('-')[0];
  const detail = await get_track_detail(track_id);
  console.log(detail);
  res.render('track/index', {
    detail: detail,
    type: 'track',
    id: detail.id
  });
});


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
  res.render('share/index', {
    detail: detail,
    type: 'event',
    id: detail.id,
    server: server,
    key: key,
    username: username,
    password: password
  });
});


router.get('/event/:event_id', async (req, res) => {
  const { event_id } = req.params;
  // const id = artist_id.split('-')[0];
  const detail = await get_event_detail(event_id);
  console.log(detail);
  res.render('event/index', {
    detail: detail,
    type: 'event',
    id: detail.id
  });
});

// Test route




////  End of definations

module.exports = router;
