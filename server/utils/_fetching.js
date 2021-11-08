


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


module.exports = _fetching
