import { createClient } from 'lightrpc';

const options = {
  timeout: 15000
};

// const easysocialUrl = process.env.STEEMJS_URL || 'https://node.banter.network';
const banterNodeUrl = process.env.STEEMJS_URL || 'https://node.banternetwork.io';

const client = createClient(banterNodeUrl, options);
console.log('[BANTER] banterNodeUrl: ', banterNodeUrl);
console.log('[BANTER] client: ', client);
console.log('[BANTER] process.env.STEEMJS_URL ->>>>>>>: ', process.env.STEEMJS_URL);
console.log('[BANTER] process.env.PORT: ', process.env.PORT);



client.sendAsync = (message, params) =>
  new Promise((resolve, reject) => {
    // rpc client -> send message and params
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
