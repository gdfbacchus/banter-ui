module.exports = {
  MAIN_ACCOUNT: {
    ID: "1.2.1111650",
    NAME: "easy-social"
  },
  LOG_ACTION_CONTEXT : {
    CREATE_ES_ACCOUNT: "Create Banter Account"
  },
  ZERORPC: {
    RECONN_ATTEMPTS: 10,
    RECONN_INTERVAL: 20000,
    CONN_ADDRESS: {
      BTC: "tcp://127.0.0.1:4242",//only for BTC
    }
  },
  ES:{
    PREFIX: "BTS",
    ASSET_NAME: "SOCIAL",
    CHAIN_ID: "9e42d42746f9f0ae04ce62e1c1bc4901db89c4b805386a23dd73ea202b1cae14",
    API_ADDRESS: process.env.STEEMJS_URL || 'https://node.banternetwork.io',
    CREATION_ACCOUNT_FEE: "5.000 SOCIAL"
  },
  BTRS: {
    PREFIX: "BTS",
    ASSET_NAME: "BTRS",
    CHAIN_ID: "9e42d42746f9f0ae04ce62e1c1bc4901db89c4b805386a23dd73ea202b1cae14",
    // API_ADDRESS: "https://node.banter.network",
    API_ADDRESS: process.env.STEEMJS_URL  || 'https://node.banternetwork.io',
    CREATION_ACCOUNT_FEE: "5.000 SOCIAL"
  }
};
