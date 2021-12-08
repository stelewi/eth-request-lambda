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
    body: '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":83}',
}


aws4.sign(requestOptions, {
    secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
    accessKeyId: 'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
});

let request = async (httpOptions) => {
    return new Promise((resolve, reject) => {

        let req = https.request(httpOptions, function(res) {

            let body = ''
            res.on('data', (chunk) => { body += chunk })
            res.on('end', () => { console.log(body); resolve(body); })

        });

        req.on('error', (e) => {
            reject(e)
        })

        req.write('{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":83}');
        req.end();
    })
}

exports.handler = async (event, context) => {
    try {
        let result = await request(requestOptions)
        response.body = JSON.stringify(result)
        return response
    } catch (e) {
        response.body = `Internal server error: ${e.code ? e.code : "Unspecified"}`
        return response
    }
}