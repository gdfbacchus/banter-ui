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
    CHAIN_ID: "4ff15a093f2777fd61a9381fc62dfb3fd54e3770494afcfb392a51352715b4e9",
    API_ADDRESS: "https://node.banter.network",
    CREATION_ACCOUNT_FEE: "5.000 SOCIAL"
  },
  BTRS: {
    PREFIX: "BTS",
    ASSET_NAME: "BTRS",
    CHAIN_ID: "4ff15a093f2777fd61a9381fc62dfb3fd54e3770494afcfb392a51352715b4e9",
    // API_ADDRESS: "https://node.banter.network",
    API_ADDRESS: process.env.STEEMJS_URL,
    CREATION_ACCOUNT_FEE: "5.000 SOCIAL"
  }
};
