const { response } = require('express');
var express = require('express');
const { reject } = require('lodash');
var request = require('request');
var router = express.Router();
const io = require("socket.io-client");

const { IAPI, BEARER_TOKEN, SOCKET, LOGIN_URL, THECUATUI_IAPI, CHAT_URL } = require('../config');

/////////////////////////////////////////
//////  UTils 
//////////////////////////////////
function getTokenFromCookieRequest(req) {
  if(req.headers.cookie) {
    if (req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken')) {
      return req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken').split('=')[1]
    }
    else return ""
  }
  return ""
  
  
  
}

const debug_log = (msg, arg) => {
  /// Get terminal size
  const x =  process.stdout.columns;
  const y =  process.stdout.rows;
  //// Log with 
  console.log('     ' + '-'.repeat(x-5));
  console.log('     ' + '- '+ msg, arg);
  console.log('     ' + '-'.repeat(x-5));
}



const _fetching = (url, method, headers, body=null) =>
  new Promise(async(resolve, reject) => {
    // console.log('-Fetching url: ', url)
    var options = {};
    if ( body === null) {
      options = {
        method: method,
        url: url,
        headers: headers
      };
    }
    else {
      options = {
        method: method,
        url: url,
        headers: headers,
        json: body
      };
    }
    

    await request(options, function(error, response) {
      if (error) {
        reject();
      }
      let response_json;
      if (typeof(response.body) === 'object') {
        response_json = response.body;
      }
      else {
        response_json = JSON.parse(response.body);
      }
      // console.log(response)
     
      console.log(response_json.status)
      if (response_json.status === 1) {
        resolve(response_json);
      }
      resolve(response_json);
    });
  });


//////////////////////////////////
///////   End Utils
////////////////////////////////////////



// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('------------------------------------------------------------------------------------------------------------------------------------------------');
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




const fetchMessageOfStream = (stream_id) =>
  new Promise(async(resolve, reject) => {
    var options = {
      method: 'GET',
      url: CHAT_URL + `/v1/chat/live/messages?room=${stream_id}`,
      headers: {}
    };

    await request(options, function(error, response) {
      if (error) {
        reject();
      }
      let response_json = JSON.parse(response.body);
      console.log(response_json.status)
      if (response_json.status === 1) {
        resolve(response_json);
      }
      resolve({});
    });

  });
////
// Stream Management
const fetchStreamInfo = stream_id => 
  new Promise(async(resolve, reject) => {
    var fetchOptions = {
      method: 'GET',
      url: IAPI + `/v1/core-api/api/event/${stream_id}`,
      headers: {}
    };
    
    await request(fetchOptions, function(error, response) {
      if (error) {
        reject();
      }
      let response_json = JSON.parse(response.body);
      console.log(response_json.status)
      if (response_json.status === 1) {
        resolve(response_json);
      }
      resolve({});
    });
  });

  const fetchStreamSource = (stream_id, token) => 
  new Promise(async(resolve, reject) => {
    var fetchOptions = {
      method: 'GET',
      url: IAPI + `/v1/core-api/api/stream/event/${stream_id}`,
      headers: {
        'Authorization': "Bearer " + token
      }
    };
    
    await request(fetchOptions, function(error, response) {
      if (error) {
        reject();
      }
      let response_json = JSON.parse(response.body);
      console.log(response_json.status)
      if (response_json.status === 1) {
        resolve(response_json);
      }
      resolve({
        status: 0,
        msg: 'err'
      });
    });
  });


  const getOwnerStreamList = (token) => 
    new Promise(async(resolve, reject) => {
      var options = {
        method: 'GET',
        url: IAPI + '/v1/core-api/api/event',
        headers: {
          'Authorization': "Bearer " + token
        }
      };
      await request(options, function(error, response) {
        if (error) {
          reject();
        }
        let response_json = JSON.parse(response.body);
        console.log(response_json.status)
        if (response_json.status === 1) {
          resolve(response_json)
        }
        resolve({
          status: 0,
          msg: 'Error',
          data: []
        });
      });
    });

  const getBalance = (user_id) => 
    new Promise(async(resolve, reject) => {
      var options = {
        method: 'GET',
        url: THECUATUI_IAPI + `/v1/payment/loyalty/accounts?user_id=${user_id}`,
        headers: {
         
        }
      };
      await request(options, function(error, response) {
        if (error) {
          reject();
        }
        let response_json = JSON.parse(response.body);
        console.log(response_json.status)
        if (response_json.status === 1) {
          resolve(response_json)
        }
        resolve({
          status: 0,
          msg: 'Error',
          data: []
        });
      });
    });




//// Upload Track 

const get_track_sumit_result = (body, token) =>
  new Promise(async (resolve, reject) => {
    var options = {
      method: 'POST',
      url: IAPI + `/v1/core-api/api/track`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      json: body
    };
    await request(options, function(error, response) {
      if (error) {
        reject();
      }
      let response_json = response.body;
      console.log(response_json.status);
      if (response_json.status === 1) {
        console.log('response_json: ', response_json);
        resolve(response_json);
      }
      resolve({});
    });
  });


  /////////////////
////  LOG IN
///////////////

const sendSMSForLoginByPhone = phone => 
  new Promise (async(resolve, reject) => {
    var options = {
      method: 'POST',
      url: LOGIN_URL + `/v1/id/auth/gen_code`,
      headers: {},
      json: {
        phone: phone
      }
    };
    await request(options, function (error, response) {
      if (error) {
        reject();
      }
      let response_json = response.body;
      console.log(response_json.status);
      if (response_json.status === 1) {
        resolve(response_json);
      }
      resolve({});
    });
  });

const loginWithPhoneOTP = (phone, otp) => 
  new Promise (async(resolve, reject) => {
    var options = {
      method: 'POST',
      url: LOGIN_URL + `/v1/id/auth/login`,
      headers: {},
      json: {
        type: "restore_by_phone",
        id_token: otp,
        user_phone: phone,
        device_id: ""
      }
    };
    await request(options, function (error, response) {
      if (error) {
        reject();
      }
      let response_json = response.body;
      console.log(response_json.status);
      if (response_json.status === 1) {
        resolve(response_json);
      }
      resolve({
        status: 0,
        msg: 'error'
      });
    });
  });

  

/////////////////////////////////////////////////////////////////////////////////////////////
//            define the home page route
////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////
//    Upload Track    /////
///////////////////////////
   

router.get('/upload', async (req, res) => {
   const headers = req.headers;
  //  console.log('Upload Page Headers : ', headers);
    res.render('dj_management/upload_track/index', {
      upload_api: IAPI + `/v1/uploader/file/media`,
      upload_banner_api: IAPI + `/v1/uploader/file/upload`
    });
  });


router.post('/upload/submit', async (req, res) => {
  const body = req.body;
  console.log('POST body: ', body);
  const token = req.headers.authorization;
  console.log('Submit track Token :', token);

  const result_submit_track = await get_track_sumit_result(body, token);
  
  console.log('submit result = ', result_submit_track);
  if (result_submit_track.status == 1)
  {
    res.send(200, {
      title: result_submit_track.data.title,
      banner: result_submit_track.data.banner,
      category: result_submit_track.data.category,
      description: result_submit_track.data.description,
      rz_point: result_submit_track.data.rz_point
    });
  }
  else {
    res.send(404, {result: 'failed', msg: result_submit_track.msg});
  }
  
});

router.get('/upload/result', async (req, res) => {
  const result = req.query.result;
  if (result == 'success') {
    const title = req.query.title;
    const banner = req.query.banner;
    const category = req.query.category;
    const description = req.query.description;
    const rz_point = req.query.rz_point;


    res.render('dj_management/upload_track/result', {
      result: result,
      title: title,
      category: category,
      banner: banner,
      description: description,
      rz_point: rz_point
    });
  }
  else {
    const msg = req.query.msg;
    res.render('dj_management/upload_track/result', {
      result: result,
      msg: msg
    });
  }
  
});


/////
//    STREAM MANAGEMENT
////
// router.get('/stream/get_list_all', async(req, res) => {
//   const token = req.headers.authorization;
//   const listOwnerStream = await getOwnerStreamList(token);
//   res.status(200).send({
//     list_stream: listOwnerStream.data,
//     status: listOwnerStream.status
//   });
// });

router.get('/stream/_all', async(req, res) => {
  // const data = req.body;
  var token = req.query.token;
  const time = req.query.time;
  if (!token && req.headers.cookie && req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken')) {
    token = req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken').split('=')[1];
  }
  const listOwnerStream = await getOwnerStreamList(token);
  console.log('-------------------------------------------------------------------------------------------------------------------------------');
  console.log(`--------------             List stream all  for token: ${token}           -----------------------------------------------------`);
  console.log('-------------------------------------------------------------------------------------------------------------------------------');
  console.log('--------------------             List Onwer Streams:', listOwnerStream);
  console.log('-------------------------------------------------------------------------------------------------------------------------------');
  console.log('-------------------------------------------------------------------------------------------------------------------------------');
  res.render('dj_management/livestream_management/list_stream', {
    list_stream: listOwnerStream.data
  });
});

router.get('/stream/balance', async(req, res) => {
  const author_id = req.query.author_id;
  const balance_resp = await getBalance(author_id);
  const balance_amount = balance_resp.data.accounts.find(e => e.account_type_short_name === 'RPDA').account_balance;
  console.log('-------------        Call balnce when socket listen to a donate event        -----------------');
  console.log('-                            Balance = ', balance_amount);
  console.log('==============================================================================================');
  res.status(200).send({
    balance: balance_amount
  });
});

router.get('/stream/:stream_id', async(req, res) => {
  const { stream_id } = req.params;
  var token = req.query.token;
  var time = req.query.time;
  /// Get stream info
  const stream_info = await fetchStreamInfo(stream_id);

  if (!token && req.headers.cookie && req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken')) {
    token = req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken').split('=')[1];
  }
  else {
    res.redirect('/console')
  }
  // const 
  console.log('-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
  console.log(`----                                                       STREAM_<ID> - ${stream_id}                                                                                -------`);
  console.log('-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
  console.log('Stream Token : ', token);
  console.log('-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
  console.log('Stream Info: ',stream_info);
  console.log('-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
  const balance_resp = await getBalance(stream_info.data.author_id);
  const mess_resp = await fetchMessageOfStream(stream_id);
  const messages = mess_resp.data.messages.map(e => ({
      user_full_name: e.user.user_full_name,
      content: e.content
  }));
  console.log(`Call API get stream messages resp : ${ JSON.stringify(messages) }`);
  const balance_amount = balance_resp.data.accounts.find(e => e.account_type_short_name === 'RPDA').account_balance;
  console.log('- Balance = ', balance_amount);
  const stream_source = await fetchStreamSource(stream_id, token);
  if (stream_source.status !== 0) {
    console.log('Stream Source: ', JSON.parse(JSON.stringify(stream_source)));
    console.log('-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
    res.render('dj_management/livestream_management/index', {
      title: stream_info.data.title,
      source: stream_source.data.streams,
      server: stream_source.data.rtmp_url,
      key: stream_source.data.stream_key,
      username: stream_source.data.stream_user,
      password: stream_source.data.stream_password,
      stream_id: stream_info.data.id,
      BEARER_TOKEN: token,
      SOCKET: SOCKET,
      author_id: stream_info.data.author_id,
      balance: balance_amount,
      messages: messages
    });
  }
  else {
    res.render('dj_management/livestream_management/index', {
      title: stream_info.data.title,
      source: 0,
      stream_id: stream_info.data.id,
      BEARER_TOKEN: token,
      SOCKET: SOCKET
    });
  }
 
});





/////////
/// LOGIN
////////////////

// router.get('/', async(req, res) => {
//   res.redirect('/dj/login');
// });

router.get('/', async(req, res) => {
  res.render('dj_management/login/index');
});

router.get('/submit_phone', async(req, res) => {
  const phone = req.query.phone;
  console.log('phone = ', phone);
  const gencode = await sendSMSForLoginByPhone(phone);
  console.log('Gencode : ' + phone + ' - status:' + gencode.status);
  res.status(200).send({
    msg: gencode.msg,
    status: gencode.status,
    phone: phone
  });
});

router.get('/input_otp', async(req, res) => {
  const phone = req.query.phone;
  res.render('dj_management/login/input_otp', {
    phone: phone
  });
});

router.get('/submit_otp', async(req, res) => {
  const phone = req.query.phone;
  const otp = req.query.otp;
  console.log('OTP verify: ' +  phone + ': ' + otp );

  const login_resp = await loginWithPhoneOTP(phone, otp);
  console.log(`Phone: ${phone} - OTP: ${otp} : Response ${JSON.stringify(login_resp)}`);
  if (login_resp.status !== 0) {
    res.status(200).send({
      status: login_resp.status,
      msg: login_resp.msg,
      user: login_resp.data.user,
      token: login_resp.data.token,
      refresh_token: login_resp.data.refresh_token
    });
  }
  else {
    res.status(200).send({
      status: login_resp.status,
      msg: login_resp.msg
    });
  }
  

});


///////////////////////////////////////////////////////////////////////////
////            Library
///////////////////////////////////////////////////////////////////////////
router.get('/library', async(req, res) => {
  const time = req.query.time;
  var token = "";
  /// Get stream info
  // const stream_info = await fetchStreamInfo(stream_id);

  if (req.headers.cookie && req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken')) {
    token = req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken').split('=')[1];
  }
  else {
    res.redirect('/console')
  }
  // const 
  console.log('-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
  console.log(`----                                                       LIBRARY:                                                                                                    -------`);
  console.log('-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
  console.log('Stream Token : ', token);
  console.log('-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
  

  /// Get track-category 
  const track_category = await _fetching(IAPI + '/v1/core-api/api/meta?type=track-category', 'GET', {});
  debug_log(`Track Categories : `, track_category)
  /// Get list owner track
  const track_list = await _fetching(IAPI + '/v1/core-api/api/track', 'GET', {
    'Authorization': 'Bearer ' + token
  })
  debug_log(`Track List : `, track_list)
  var album_list = await _fetching(IAPI + '/v1/core-api/api/album', 'GET', {
    'Authorization': 'Bearer ' + token
  });
  

  async function get_tracks_info_to_album_list(list) {
    for (let i=0; i< list.length; i++) {
      list[i].tracks_info = [];
      for (let j=0; j < list[i].tracks.length; j++) {
        let track_data =  await _fetching(IAPI + `/v1/core-api/api/track/${list[i].tracks[j]}`, 'GET', {
          'Authorization': 'Bearer ' + token
        })
        debug_log(`Track fetching ${list[i].tracks[j]}`, track_data.data)
        list[i].tracks_info.push(track_data.data)
      }
    }
  }

  await get_tracks_info_to_album_list(album_list.data).catch(err => {
    console.log(err);
  });


  debug_log(`Album List : `, album_list.data)
  
  res.render('dj_management/library/index', {
    track_category: track_category.data,
    track_list: track_list.data,
    album_list: album_list.data,
    p_tracks: 1
  });
});

router.get('/library/get_data_load_more', async(req, res) => {
  const time = req.query.time;
  const page = req.query.p;
  var token = "";
  
  if (req.headers.cookie && req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken')) {
    token = req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken').split('=')[1];
  }
  else {
    res.status(200).send({
      msg: 'Non-token for load more action !',
      err_code : "TOKEN_NOT_FOUND",
      status: 0
    });
  }
  
  
  /// Get track-category 
  const track_category = await _fetching(IAPI + '/v1/core-api/api/meta?type=track-category', 'GET', {});
  
  const load_more_track_list = await _fetching(IAPI + `/v1/core-api/api/track?page=${page}`, 'GET', {
    'Authorization': 'Bearer ' + token
  })
  

  if (load_more_track_list.total < (Number(page) - 2 ) * 10) {
    load_more_track_list.data = []
  }

  debug_log(`load more Track List (page=${page}) : `, load_more_track_list)

  res.status(200).send({
    load_more_track_list: load_more_track_list.data,
    track_category: track_category.data,
    status: 1,
    msg: 'success',
    err_code: ""
  });
})



///////////////////////////////////////////////////////////////////////////
////            Create Album
///////////////////////////////////////////////////////////////////////////
router.get('/create_album', async(req, res) => {
  const time = req.query.time;
  var token = "";
  if (req.headers.cookie && req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken')) {
    token = req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken').split('=')[1];
  }
  else {
    res.redirect('/console')
  }

  const track_list = await _fetching(IAPI + '/v1/core-api/api/track', 'GET', {
    'Authorization': 'Bearer ' + token
  })

    /// Get track-category 
    const track_category = await _fetching(IAPI + '/v1/core-api/api/meta?type=track-category', 'GET', {});
    debug_log(`Track Categories : `, track_category)

  res.render('dj_management/create_album/index', {
    track_list: track_list.data,
    track_category: track_category.data,
    upload_banner_api: IAPI + `/v1/uploader/file/upload`,
    p: 1
  })
});

router.get('/create_album/get_data_load_more', async(req, res) => {
  const time = req.query.time;
  const page = req.query.p;
  var token = "";
  
  if (req.headers.cookie && req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken')) {
    token = req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken').split('=')[1];
  }
  else {
    res.status(200).send({
      msg: 'Non-token for load more action !',
      err_code : "TOKEN_NOT_FOUND",
      status: 0
    });
  }
  
  
  /// Get track-category 
  const track_category = await _fetching(IAPI + '/v1/core-api/api/meta?type=track-category', 'GET', {});
  
  const load_more_track_list = await _fetching(IAPI + `/v1/core-api/api/track?page=${page}`, 'GET', {
    'Authorization': 'Bearer ' + token
  })
  

  if (load_more_track_list.total < (Number(page) - 2 ) * 10) {
    load_more_track_list.data = []
  }

  debug_log(`load more (page=${page}) : `, load_more_track_list)

  res.status(200).send({
    load_more_track_list: load_more_track_list.data,
    track_category: track_category.data,
    status: 1,
    msg: 'success',
    err_code: ""
  });
})

///// Submit data to create album
router.post('/create_album/submit_album', async(req, res) => {
  const time = req.query.time;
  var token = "";
  
  if (req.headers.cookie && req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken')) {
    token = req.headers.cookie.split(';').find(e => e.trim().split('=')[0] === 'BearerToken').split('=')[1];
  }
  else {
    res.status(200).send({
      msg: 'Non-token for load more action !',
      err_code : "TOKEN_NOT_FOUND",
      status: 0
    });
  }

  var body = req.body;
 body.tracks = body.tracks.split(',');
  
  const submit_album_resp = await _fetching(IAPI + '/v1/core-api/api/album', 'POST', {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }, 
    body
  )
  
  debug_log('Req submit album resp = ', submit_album_resp)

  res.status(200).send(submit_album_resp);
})




////  End of definations

module.exports = router;
