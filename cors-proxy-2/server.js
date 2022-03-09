var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    console.log('[BANTER] req.url: ', req.url);
    console.log('[BANTER] req.method: ', req.method);
    console.log('[BANTER] req.body: ', req.body);

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        let targetURL = req.header('Target-URL');

        console.log('[BANTER] targetURL from header: ', targetURL);
        console.log('[BANTER] process.env.TARGET_URL: ', process.env.TARGET_URL);
        //'https://node.easysocial.life'

        console.log("[BANTER] req.header Target-URL: ",targetURL);
        if(!targetURL) {
            const target = process.env.TARGET_URL || 'https://node.banter.network';
            // const target = 'https://node.banter.network';
          res.set('Target-URL', target);
          // res.set('Target-URL', '79.143.179.62:8090');
            targetURL = target;
        }
        console.log("[BANTER] REQUEST HEADERS: ",req.headers);
        // targetURL = req.header('Target-URL');
        // targetURL = '79.143.179.62:8090';

        console.log("[BANTER] Updated target: ",targetURL);
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-Endpoint header in the request' });
            return;
        }
        request({ url: targetURL + req.url, method: req.method, json: req.body },
            function (error, response, body) {
                console.error('[BANTER] error:', error); // Print the error if one occurred
                console.log('[BANTER] statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('[BANTER] body:', body); // Print the HTML for the Google homepage.
                if (error) {
                    if (response) {
                        console.error('[BANTER] proxy error response.statusCode: ' + response.statusCode)
                    }
                    console.error('[BANTER] PROXY ERROR:: ', error)
                } else {
                    if (response) {
                        console.log("[BANTER] target response.body: ",response.body);
                        console.error('[BANTER] target response.statusCode: ' + response.statusCode);
                    }
                }
//                console.log(body);
            }).pipe(res);
    }
});

app.set('port', process.env.PORT || 8282);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});


// var express = require('express'),
//     request = require('request'),
//     bodyParser = require('body-parser'),
//     app = express();
//
// var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
// console.log('Using limit: ', myLimit);
//
// app.use(bodyParser.json({limit: myLimit}));
//
// app.all('*', function (req, res, next) {
//
//     // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
//     res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
//
//     if (req.method === 'OPTIONS') {
//         // CORS Preflight
//         res.send();
//     } else {
//         var targetURL = req.header('Target-URL'); // Target-URL ie. https://example.com or http://example.com
//         console.log('[BANTER] targetURL: ', targetURL);
//         console.log('[BANTER] req.url: ', req.url);
//         console.log('[BANTER] req.method: ', req.method);
//         console.log('[BANTER] req.body: ', req.body);
//         if (!targetURL) {
//             res.send(500, { error: 'There is no Target-Endpoint header in the request' });
//             return;
//         }
//         request({ url: targetURL + req.url, method: req.method, json: req.body, headers: {'Authorization': req.header('Authorization')} },
//             function (error, response, body) {
//                 if (error) {
//                     console.error('error: ' + response.statusCode)
//                 }
// //                console.log(body);
//             }).pipe(res);
//     }
// });
//
// app.set('port', process.env.PORT || 3000);
//
// app.listen(app.get('port'), function () {
//     console.log('Proxy server listening on port ' + app.get('port'));
// });
