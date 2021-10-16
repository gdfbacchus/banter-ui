import { createClient } from 'lightrpc';

const options = {
  timeout: 15000
};

 // const steemUrl = process.env.STEEMJS_URL || 'https://api.steemit.com';
// const steemUrl = process.env.STEEMJS_URL || 'http://79.143.179.62:8080';
// const steemUrl = process.env.STEEMJS_URL || 'http://localhost:8080';
// const steemUrl = process.env.STEEMJS_URL || 'http://79.143.179.62:8282';//PROXY
// const steemUrl = process.env.STEEMJS_URL || 'https://proxy.easysocial.life';//PROXY
const easysocialUrl = process.env.STEEMJS_URL || 'https://proxy.banter.gg';//PROXY

// console.log('Client steemAPI process.env.STEEMJS_URL: ',process.env.STEEMJS_URL);
// console.log("Client steemUrl: ", steemUrl);

//console.log('Client easysocial _URL: ',easysocialUrl);

const client = createClient(easysocialUrl, options);
client.sendAsync = (message, params) =>
  new Promise((resolve, reject) => {
    //rpc client -> send message and params
    // if(message==='get_discussions_by_trending'){
    //   message='tags_api.get_discussions_by_trending'
    //   params = [ { tag: 'steem', limit: 10 } ];
    // }
    // console.log("c new message: ",message);
    // console.log("c new params: ",params);
    client.send(message, params, (err, result) => {
      if (err) {
        console.log("c------------------------------------------");
        console.log("message: ", message);
        console.log("params: ", params);
        console.log("c err: ", err);
        console.log("c------------------------------------------");
      } else {
        // console.log("c------------------------------------------");
        // console.log('client steemApi request');
        // console.log('c message: ',message);
        // console.log('c params: ',params);
        // console.log("c result: ",result);
        // console.log("c------------------------------------------");
      }
      if (err !== null) return reject(err);
      return resolve(result);
    });
  });

export default client;
