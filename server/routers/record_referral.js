var express = require('express');
var request = require('request');
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('- URL: ', req.url, Date.now());
    next();
});
const get_full_name = referral_token =>
    new Promise(async(resolve, reject) => {
        var options = {
            method: 'GET',
            url: `https://api-staging.thecuatui.net/v1/id/common/get_user_fullname/${referral_token}?app=web`,
            headers: {}
        };
        await request(options, function(error, response) {
            if (error) {
                reject();
            }
            let response_json = JSON.parse(response.body);
            console.log(response_json.status);
            // if (response_json.status === 1) {
            //     resolve(response_json.data);
            // }
            // resolve({});
            resolve(response_json);
        });
    });
const record_referral = (referral_token, phone) =>
    new Promise(async(resolve, reject) => {
        var options = {
            method: 'GET',
            url: `https://api-staging.thecuatui.net/v1/id/common/record_referral/${referral_token}?app=web&phone=${phone}`,
            headers: {}
        };
        await request(options, function(error, response) {
            if (error) {
                reject();
            }
            let response_json = JSON.parse(response.body);
            console.log(response_json.status);
            // if (response_json.status === 1) {
            //     resolve(response_json.data);
            // }
            // resolve({});
            resolve(response_json);
        });
    });
// define the home page route

router.get('/', async(req, res) => {
    res.render('error/500');
});

router.get('/:referral_token', async(req, res) => {
    const token = req.params['referral_token'];
    const detail = await get_full_name(token);
    console.log('fullname res = ' + detail);
    if (detail.status === 1) {
        res.render('record_referral/index', {
            fullname: detail.data.fullname,
            token: token
        });
        console.log('This is referall from token: ' + token);
    } else {
        res.render('error/404');
    }
});

// router.get('/:referral_token/input-phone', async(req, res) => {
//     const token = req.params['referral_token'];
//     res.render('record_referral/input-phone', { token: token });
// });

router.get('/record/:referral_token', async(req, res) => {
    const token = req.params['referral_token'];
    const phone = req.query.phone;
    if (phone) {
        console.log('Record - Phone  =' + phone);
        const record_result = await record_referral(token, phone);
        console.log('Record Referral: ', token, phone, record_result);
        if (record_result.status === 1) {
            res.status(200).send(record_result);
        } else {
            if (record_result.msg === 'Phone exited.') {
                res.status(200).send(record_result);
            }
        }
    } else {
        res.status(500);
        res.render('error/500');
    }
});

// router.get('/download-app/links', async(req, res) => {
//     res.render('record_referral/download-app');
// });
module.exports = router;