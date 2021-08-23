var express = require('express');
var request = require('request');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('URL: ', req.url, Date.now());
  next();
});
const get_detail = id =>
  new Promise(async (resolve, reject) => {
    var options = {
      method: 'GET',
      url: `https://api.thecuatui.net/v1/metadata/coupons/${id}`,
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
// define the home page route
router.get('/:coupon_id', async (req, res) => {
  const { coupon_id } = req.params;
  const id = coupon_id.split('-')[0];
  const detail = await get_detail(id);
  console.log(detail);
  res.render('share/index', { detail: detail });
});

module.exports = router;
