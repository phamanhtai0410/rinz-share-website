var express = require('express');
var request = require('request');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('URL: ', req.url, Date.now());
  next();
});

const get_list_classes = (bank_code, token) =>
  new Promise(async (resolve, reject) => {
    var options = {
      method: 'GET',
      url: `https://api-staging.thecuatui.net/v1/card-issue/classes?bank_code=${bank_code}`,
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    };
    await request(options, function(error, response) {
      if (error) {
        reject();
      }
      let response_json = JSON.parse(response.body);
      console.log('classes :' + JSON.stringify(response_json));
      resolve(response_json);
    });
  });

const get_list_kyc = (bank_code, token) =>
  new Promise(async (resolve, reject) => {
    var options = {
      method: 'GET',
      url: `https://api-staging.thecuatui.net/v1/card-issue/kyc?bank_code=${bank_code}`,
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    };
    await request(options, function(error, response) {
      if (error) {
        reject();
      }
      let response_json = JSON.parse(response.body);
      console.log('kyc : ' + response_json.status);
      resolve(response_json);
    });
  });

const submit_card_issue = (body, token) =>
  new Promise(async (resolve, reject) => {
    var options = {
      method: 'POST',
      url: `https://api-staging.thecuatui.net/v1/card-issue/kyc`,
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };
    await request(options, function(error, response) {
      if (error) {
        reject();
      }
      let response_json = JSON.parse(response.body);
      console.log(response_json.status);
      resolve(response_json);
    });
  });
// define the home page route

router.get('/', async (req, res) => {
  res.render('error/500');
});

router.get('/classes', async (req, res) => {
  const bank_code = req.query.bank_code;
  const token = req.query.token;
  const detail = await get_list_classes(bank_code, token);
  console.log('+ card-register =' + JSON.stringify(detail));
  if (detail.status === 1) {
    res.render('card-issue/classes', {
      classes: detail.data.classes,
      bank_code: bank_code,
      token: token
    });
    console.log(' - This is classes from bank: ' + bank_code);
  } else {
    res.render('error/404');
  }
});

router.get('/card-register', async (req, res) => {
  const bank_code = req.query.bank_code;
  const class_id = req.query.class_id;
  const token = req.query.token;
  const detail = await get_list_kyc(bank_code, token);
  if (detail.status === 1) {
    res.render('card-issue/card_register', {
      kyc: detail.data.kyc,
      fullname: detail.data.fullname,
      phone: detail.data.phone,
      class_id: class_id,
      token: token
    });
    console.log(' - This is kyc for bank: ' + bank_code);
  } else {
    res.render('error/404');
  }
});

router.post('/card-register/submit', async (req, res) => {
  const body = req.body;
  const token = req.query.token;
  console.log('Submit Register Card: ', body);
  // console.log('Submit Register Card: ', JSON.stringify(body));
  if (body) {
    const result = await submit_card_issue(body, token);
    console.log('- Submit Result: ' + result);
    if (result.status === 1) {
      res.status(200).send(result);
    } else {
      if (result.error_code === 'ERROR_MISSING_DATA') {
        res.status(200).send(result);
      }
    }
  } else {
    res.status(500);
    res.render('error/500');
  }
});

router.get('/card-register/show-result', async (req, res) => {
  const result = req.query.result;
  if (result === 'success') {
    res.render('card-issue/success');
  } else if (result === 'failed') {
    let status = req.query.status ;
    let error = req.query.error ;
    if (status === 'none') {
      status = 'ERROR';
      error = 'MISSING DATA'
    }
    else if (status === 'timeout') {
      status = 'TIMEOUT',
      error = 'TIMEOUT ERROR'
    }
    res.render('card-issue/failed', {
      status: status,
      error: error
    });
  }
});

module.exports = router;
