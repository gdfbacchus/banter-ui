import constants from '../server/routes/common/constants';
const dsteem = require('dsteem');
let opts = {};
opts.addressPrefix = 'BTS';
opts.chainId = '9e42d42746f9f0ae04ce62e1c1bc4901db89c4b805386a23dd73ea202b1cae14';

//connect to server which is connected to the network/testnet
const dsteemClient = new dsteem.Client(constants.BTRS.API_ADDRESS,opts);

export default dsteemClient;

