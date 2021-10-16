const dsteem = require('dsteem');
const constants = require('../common/constants');
const steemClient = require('@steemit/steem-js');
steemClient.api.setOptions({ url: 'http://79.143.179.62:8282' });

const  createPost = (req,res,next) => {
  //console.log("CREATE POST ROUTE BODY: ",req.body);
  /*
   const bodyR = {
     "op": 'comment',
     "privKey": postingWif,
     parent_author: parentAuthor,
     parent_permlink: parentPermlink,
     author,
     permlink,
     title,
     body,
     json_metadata: JSON.stringify(jsonMetadata)
   };
  */
  console.log("req.body.op: ",req.body.op);
  console.log("req.body.privKey: ",req.body.privKey.trim());
  console.log("req.body.params[2]: ",req.body.parent_author);
  console.log("req.body.params[3]: ",req.body.parent_permlink);
  console.log("req.body.params[4]: ",req.body.author);
  console.log("req.body.params[5]: ",req.body.permlink);
  console.log("req.body.params[6]: ",req.body.title);
  console.log("req.body.params[7]: ",req.body.body);
  console.log("req.body.params[8]: ",JSON.stringify(req.body.json_metadata));


  const privKey = req.body.privKey;
  const op = [
    req.body.op,
    {
      parent_author: req.body.parent_author,
      parent_permlink: req.body.parent_permlink,
      author: req.body.author,
      permlink: req.body.permlink,
      title: req.body.title,
      body: req.body.body,
      json_metadata: JSON.parse(JSON.stringify(req.body.json_metadata)),
    },
  ];


  let opts = {};
//connect to production server
  opts.addressPrefix = constants.ES.PREFIX;
  opts.chainId = constants.ES.CHAIN_ID;

//connect to server which is connected to the network/production
  let client = new dsteem.Client(constants.ES.API_ADDRESS);

  // const op = [
  //   'account_create',
  //   {
  //     creator: creatorName,
  //     new_account_name: accountName,
  //     owner: ownerAuth,
  //     active: activeAuth,
  //     posting: postingAuth,
  //     memo_key: memoKey,
  //     json_metadata: '',
  //     fee: constants.ES.CREATION_ACCOUNT_FEE
  //   }
  // ];
  console.log("Operations: ",op);
  //const privKey = dsteem.PrivateKey.fromString(privateKey);
  const privKey2 = dsteem.PrivateKey.from(privKey);//That's Working
  console.log("P KEY: ",privKey2);
  //client.disconnect()

  steemClient.broadcast.send(
    { operations: [op], extensions: [] },
    { posting: privKey2 },
    (err, result) => {
      /** Save in database the operations broadcasted */
      if (!err) {
        console.log('CREATED POST');
        res.json({ result });
      } else {
        console.log("WASN't CREATED POST ERROR: ",err);
        res.status(500).json({
          error: 'server_error',
          error_description:  err.message || err,
        });
      }
    }
  );
  return;
  client.broadcast.sendOperations([op], privKey2).then(
    //client.disconnect()
    // client=null;
    function(result) {
      client = null;
      console.log("Included in block: ",result.block_num);
      res.status(200);
      res.send(JSON.stringify({"error":"", "response":result}));
    },
    function(error) {
      client = null;
      console.log("CREATION POST ERROR: ");
      console.error(error);
      res.status(500);
      res.send(JSON.stringify({"error":"POST WASN'T CREATED!","response":""}));
    }
  );
};

module.exports.createPost = createPost;


