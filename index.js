const https = require('https')
var aws4  = require('aws4')

let response = {
    statusCode: 200,
    headers: {'Content-Type': 'application/json'},
    body: ""
}

let requestOptions = {
    timeout: 10000,
    host: "nd-a6cusdf2brgzpdfxteickip7uq.ethereum.managedblockchain.eu-west-2.amazonaws.com",
    method: "POST",
    region: 'eu-west-2',
    body: '',
}

let request = async (httpOptions) => {
    return new Promise((resolve, reject) => {

        let req = https.request(httpOptions, function(res) {

            let body = ''
            res.on('data', (chunk) => { body += chunk })
            res.on('end', () => { resolve(body); })

        });

        req.on('error', (e) => {
            reject(e)
        })

        req.write(httpOptions.body);
        req.end();
    })
}

exports.handler = async (event, context) => {
    try {

        requestOptions.body = JSON.stringify(event);

        aws4.sign(requestOptions, {
            secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
            accessKeyId: 'AKIATIZWXR4RQUHVAPD7',
        });

        console.log(requestOptions)

        let result = await request(requestOptions)
        response.body = JSON.stringify(result)
        return response
    } catch (e) {
        response.body = `Internal server error: ${e.code ? e.code : "Unspecified"}`
        return response
    }
}