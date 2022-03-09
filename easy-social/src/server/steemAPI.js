const createClient = require('lightrpc').createClient;

const url = process.env.STEEMJS_URL || 'https://node.banter.network';
// const url = process.env.STEEMJS_URL || 'https://proxy.banter.network';//PROXY

const port = process.env.PORT;
console.log('Server steemAPI process.env.STEEMJS_URL: ',process.env.STEEMJS_URL);
console.log('Server steemAPI URL: ',url);
console.log('Server port: ', port);
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
