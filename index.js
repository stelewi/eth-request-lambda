const https = require('https')
var aws4  = require('aws4')

let response = {
    statusCode: 200,
    headers: {'Content-Type': 'application/json'},
    body: ""
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

        let requestOptions = {
            host: "nd-a6cusdf2brgzpdfxteickip7uq.ethereum.managedblockchain.eu-west-2.amazonaws.com",
            method: "POST",
            path: "/",
            region: 'eu-west-2',
            headers: {
                "Content-Type" : "application/json"
            }
        }

        requestOptions.body = event.body;
        requestOptions.headers.date = new Date();

        aws4.sign(requestOptions, {
            secretAccessKey: 'XXXXXXXXXXXXXXXXXXXXXXX',
            accessKeyId: 'AKIATIZWXR4RR3O4M3MR',
        });

        console.log(requestOptions)

        let result = await request(requestOptions)
        response.body = JSON.stringify(result)

        console.log(result.message);

        return response
    } catch (e) {
        response.body = `Internal server error: ${e.code ? e.code : "Unspecified"}`
        return response
    }
}