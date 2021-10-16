const createClient = require('lightrpc').createClient;

// const url = process.env.STEEMJS_URL || 'https://api.steemit.com';
// const url = process.env.STEEMJS_URL || 'http://79.143.179.62:8080';
// const url = process.env.STEEMJS_URL || 'http://localhost:8080';
// const url = process.env.STEEMJS_URL || 'http://79.143.179.62:8282';//PROXY
const url = process.env.STEEMJS_URL || 'https://proxy.banter.gg';//PROXY
console.log('Server steemAPI process.env.STEEMJS_URL: ',process.env.STEEMJS_URL);
console.log('Server steemAPI URL: ',url);
const client = createClient(url);


client.sendAsync = (message, params) =>
  new Promise((resolve, reject) => {
    client.send(message, params, (err, result) => {
      //rpc client -> send message and params
      // console.log('s server steemApi request');
      // console.log('s message: ',message);
      // console.log('s params: ',params);
      if (err !== null) return reject(err);
      return resolve(result);
    });
  });

module.exports = client;
