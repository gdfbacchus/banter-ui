import { Client } from 'busyjs';

function createBusyAPI() {
  //const url = 'wss://api.busy.org';
  const url = 'ws://79.143.179.62:8090';
  const client = new Client(url);
  console.log("Connect to ws server["+url+"]...");
  // const client = new Client('ws://127.0.0.1:8090');
  //const client = new Client('ws://79.143.179.62:8090');

  client.sendAsync = (message, params) =>
    new Promise((resolve, reject) => {
      client.call(message, params, (err, result) => {
        console.log("ws err: ",err);
        console.log("ws result: ",result);

        if (err !== null) return reject(err);
        return resolve(result);
      });
    });

  return client;
}

export default createBusyAPI;
