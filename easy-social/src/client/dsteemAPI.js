
const dsteem = require('dsteem');
let opts = {};
opts.addressPrefix = 'BTS';
opts.chainId = '4ff15a093f2777fd61a9381fc62dfb3fd54e3770494afcfb392a51352715b4e9';

//connect to server which is connected to the network/testnet
const dsteemClient = new dsteem.Client('https://proxy.banter.network',opts);

export default dsteemClient;

