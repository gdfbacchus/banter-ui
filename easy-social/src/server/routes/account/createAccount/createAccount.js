const dsteem = require('dsteem');
const aes256 = require('aes256');
const codeMaker = require('../../common/utils/makeEasydexCode');
const constants = require('../../common/constants');
import {Apis} from "bitsharesjs-ws";
var {ChainStore} = require("bitsharesjs");

/* const bts_node_addr = "wss://eu-central-1.bts.crypto-bridge.org" //"wss://netherlands.bitshares.apasia.tech/ws" //"wss://na.openledger.info/ws"; //"wss://new-york.bitshares.apasia.tech/ws" // "wss://api.open-asset.tech/ws"//"wss://btsws.roelandp.nl/ws" //"wss://api-ru.bts.blckchnd.com" //"wss://atlanta.bitshares.apasia.tech/ws" //"wss://bitshares.crypto.fans/ws" //"ws://93.104.208.139:8090"//"wss://api.bts.network" //'wss://api.bts.blckchnd.com';//"wss://bitshares.openledger.info/ws"
Apis.instance(bts_node_addr, true).init_promise.then((res) => {
  console.log("ES BE connected to:", res[0].network);
  ChainStore.init().then(() => {
    //ChainStore.subscribe(updateState);
  });
}); */

const  createAccount = (req,res,next) => {
  //console.log("CREATE ACCOUNT ROUTE BODY: ",req.body);
  const creatorName = req.body.params[0];
  const accountName = req.body.params[1];
  const metaData = req.body.params[2];
  const ownerKey = req.body.params[3];
  const activeKey = req.body.params[4];
  const postingKey = req.body.params[5];
  const memoKey = req.body.params[6];

  /*
  const data = {
    creatorName,
    accountName,
    metaData,
    ownerKey,
    activeKey,
    postingKey,
    memoKey,
    broadcast
  };
  console.log("DATA: ",data);
  */
  const hash = "dND22+ZAwKhebz3AVaofHFNQuVlfamJkwcUi56uVfIdxaTJ3dLMwPWFaC2ChYzDtpNxW8f1NLGb4RNW/vdYNScP5Tw==";
  const envs = JSON.parse(JSON.stringify(process.env));
  const secretKey = envs.CA_SECRET.trim();
  const privateKey = aes256.decrypt(secretKey, hash);

  let opts = {};
//connect to production server
  opts.addressPrefix = constants.ES.PREFIX;
  opts.chainId = constants.ES.CHAIN_ID;

  let client = new dsteem.Client(constants.ES.API_ADDRESS, opts);

  let avail = 'Account is NOT available to register';
  const _account = client.database.call('get_accounts', [[accountName]]).then((resp)=>{
    if (resp.length ===0) {

      //CHECK IF BTS ACCOUNT EXISTS
    //  let counter = 1;
      let id = setInterval(()=>{
      /*  if(counter===10){
          console.log("Count limit is exceeded. There is no BTS account.");
          clearInterval(id);
          res.status(500);
          res.send(JSON.stringify({"error":"BTS account is not found.","response":""}));
          return;
        }

        //console.log("Get bts account counter: ",counter);
        let acc = ChainStore.getAccount(accountName);
        if(acc) {
          //console.log("Counter: ",counter)
          console.log("Found BTS Account");
          console.log("---------------------------------");
          console.log('ES Account is available to register');
          clearInterval(id);

          //TEST GET PUBLIC KEY WITH BST PREFIX
           const activeKeyS = dsteem.PrivateKey.fromLogin(accountName, 'pass1234', 'active');
           const arr = activeKeyS.createPublic("BTS");
           console.log("activeKeyS: ",activeKeyS);
           console.log("arr: ",arr);
           */

          const ownerAuth = {
            weight_threshold: 1,
            account_auths: [],
            key_auths: [[ownerKey, 1]],
          };
          const activeAuth = {
            weight_threshold: 1,
            account_auths: [],
            key_auths: [[activeKey, 1]],
          };
          const postingAuth = {
            weight_threshold: 1,
            account_auths: [],
            key_auths: [[postingKey, 1]],
          };

          const op = [
            'account_create',
            {
              creator: creatorName,
              new_account_name: accountName,
              owner: ownerAuth,
              active: activeAuth,
              posting: postingAuth,
              memo_key: memoKey,
              json_metadata: '',
              fee: constants.ES.CREATION_ACCOUNT_FEE
            }
          ];
          /*
          //TEST
          console.log("Operations: ",op);
          console.log("fee: ",op[1].fee);
          console.log("constants.ES.CREATION_ACCOUNT_FEE: ",constants.ES.CREATION_ACCOUNT_FEE);
          console.log("CREATION ACCOUNT ERROR AMOUNT: ");
          console.error(error);
          res.status(500);
          res.send(JSON.stringify({"error":error,"response":""}));
          return;
          //END TEST
          */
          //const privKey = dsteem.PrivateKey.fromString(privateKey);
          const privKey2 = dsteem.PrivateKey.from(privateKey);//That's Working
          console.log("PKEY: ",privKey2)

          //client.disconnect()

          client.broadcast.sendOperations([op], privKey2).then(
            //client.disconnect()
            // client=null;
            function(result) {
              client = null;
              console.log("Included in block: ",result.block_num);
              res.status(200);
              res.send(JSON.stringify({"error":"", "response":"ACCOUNT CREATED! Included in block["+result.block_num+"]"}));
            },
            function(error) {
              client = null;
              console.log("CREATION ACCOUNT ERROR: ");
              console.error(error);
              res.status(500);
              res.send(JSON.stringify({"error":error,"response":""}));
            }
          );

        // }
          // console.log("=================================");
          // counter++;
      },100);

    } else {
      res.status(500);
      res.send(JSON.stringify({"error":"ES ACCOUNT ALREADY TAKEN!","response":""}));
      return;
    }



  });
};

const encryptStr = (req,res,next) => {
  let str = req.body.str;
  let key = codeMaker.makeEasydexCode(59);
  const encryptedStr = aes256.encrypt(key, str);
  let decryptedStr = aes256.decrypt(key, encryptedStr)

  res.send( JSON.stringify({encryptedStr, key, decryptedStr}) );
};


module.exports.createAccount = createAccount;
module.exports.encryptStr = encryptStr;
