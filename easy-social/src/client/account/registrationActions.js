
import { createAction } from 'redux-actions';
// import {Apis} from "bitsharesjs-ws";
// import {ChainStore, PrivateKey, key, Aes} from "bitsharesjs";
// import WalletDb from "./loginBts/stores/WalletDb";
const dsteem = require('dsteem');
import {getAccount} from "../helpers/apiHelpers"
import endpoints from "../costants/endpoints";

//import steem from '@steemit/steem-js';
//const privateWif = steem.auth.toWif(username, password, roles[0]);
//steem.auth.isWif(password)
//const publicWif = steem.auth.wifToPublic(privateWif);

//if (
//  (roles[i] === 'memo' && account.memo_key === publicWif) ||
//  (roles[i] !== 'memo' && this.keyAuthsHasPublicWif(account[roles[i]].key_auths, publicWif))
//)

/** Create proxy account */
/*

await steem.broadcast.accountCreateWithDelegationAsync(
  auth.wif,
  accountCreationFee,
  '0.000000 VESTS',
  auth.username,
  clientId,
  owner,
  active,
  posting,
  publicKeys.memo,
  { owner: this.props.auth.user.name },
  []
).then(async () => {
  // Wait 5 seconds to insure the newly created account is indexed on the node
  await sleep(5000);

  // Send request to server for create app
  fetch(`/api/apps/@${clientId}`, {
    headers: new Headers({
      Authorization: this.props.auth.token,
    }),
    method: 'POST',
  })
    .then(res => res.json())
    .then((data) => {
      if (!data.error) {
        // Redirect to edit app
        browserHistory.push(`/apps/@${clientId}/edit`);
        notification.success({
          message: intl.formatMessage({ id: 'success' }),
          description: intl.formatMessage({ id: 'success_proxy_account' }, { clientId }),
        });
      } else {
        this.setState({ isLoading: false });
        notification.error({
          message: intl.formatMessage({ id: 'error' }),
          description: data.error || intl.formatMessage({ id: 'general_error' }),
        });
      }
    });
}).catch((err) => {
  this.setState({ isLoading: false });
  notification.error({
    message: intl.formatMessage({ id: 'error' }),
    description: getErrorMessage(err) || intl.formatMessage({ id: 'general_error' }),
  });
});
*/
const TYPES = {
  SET_IS_AV_REG_ACCOUNT: "SET_IS_AV_REG_ACCOUNT",
  LOGIN_ERROR: '@es_auth/LOGIN_ERROR',
  SET_IS_AV_REG_PASS: "SET_IS_AV_REG_PASS",
  RGISTRATION_START: "RGISTRATION_START",
  RGISTRATION_SUCCESS: "RGISTRATION_SUCCESS",
  RGISTRATION_ERROR: "RGISTRATION_ERROR",
  RESET_REGISTRATION: "RESET_REGISTRATION"
};

const loginError = createAction(TYPES.LOGIN_ERROR);


export const isAvailableAccount = (accountName) => (dispatch, getState, { steemAPI }) => {

  //console.log("ACCTION CHECK ACCOUNT FOR REG");

/*  let counter = 1;
  let id = setInterval(()=>{
    if(counter===5){
      //console.log("Count limit["+counter+"] is exceeded. There is no BTS account.");
      clearInterval(id);
      return dispatch({
        type: TYPES.SET_IS_AV_REG_ACCOUNT,
        payload: {
          isAvailableAccount: false,
        }
      })//.catch(() => dispatch(loginError()));
    }

    let acc = ChainStore.getAccount(accountName);
    //console.log("BTS Account 0: ",acc);
    if(acc){
      console.log("Found BTS Account: ",acc);
      //console.log("---------------------------------");
      clearInterval(id); */


      let getAccountPromise = steemAPI.sendAsync('condenser_api.get_accounts', [[accountName]])
      // let getAccountPromise = steemAPI.sendAsync('condenser_api.get_accounts', [["vasko-1-test31"]])
      // steemAPI.sendAsync('condenser_api.get_accounts', [["kids-trail"]])//WORKING QUERY
        .then((resp) => {
          let isAv = false;

          if(resp.length===0) {
            console.log("There is no such ES account: ",resp);
            isAv = true;
          }
          else if(resp.length === 1) {
            console.log("Found ES account - response: ",resp)
          }
          // else {
          //   console.log("Found some ES accounts - response: ",resp)
          // }

          return dispatch({
            type: TYPES.SET_IS_AV_REG_ACCOUNT,
            payload: {
              isAvailableAccount: isAv,
            }
          })//.catch(() => dispatch(loginError()));
        })
        .catch((err)=>{
          console.log("ERROR: ",err)
        });

    }/* else if(acc === null) {
      console.log("BTS NULL Account: ",acc);
      console.log("BTS account is not exist.");
      clearInterval(id);
      return dispatch({
        type: TYPES.SET_IS_AV_REG_ACCOUNT,
        payload: {
          isAvailableAccount: false,
        }
      })//.catch(() => dispatch(loginError()));
    }
    console.log("=================================");
    counter++;
  },100); */
// };

export const isAvailablePassword = (accountName, pass) => (dispatch, getState, { steemAPI }) => {
  // console.log("isAvailablePassword Action");
  // console.log("accountName: ",accountName);
  // console.log("pass: ",pass);
  
  // const isValidPass = WalletDb.validatePassForRegistration(pass, accountName);
  //
  // isValidPass.then( (isValid)=>{
  //   return dispatch({
  //     type: TYPES.SET_IS_AV_REG_PASS,
  //     payload: {
  //       isAvailablePassword: isValid,
  //     }
  //   })//.catch(() => dispatch(loginError()));
  // }).catch((err)=>{
  //   console.log("err: ",err);
  // });



};

export const startRegistration = () => (dispatch) => {
  return dispatch({
    type: TYPES.RGISTRATION_START,
    payload: {}
  })
};
export const resetRegistration = () => (dispatch) => {
  return dispatch({
    type: TYPES.RESET_REGISTRATION,
    payload: {}
  })
};

export const register = (accountName, password) => (dispatch, getState, { steemAPI }) => {
  console.log("Call Registration Action");
  const state = getState();

  let promise = Promise.resolve(null);

  // if (getIsLoaded(state)) {
  //   promise = Promise.resolve(null);
  // }

  let getAccountPromise = getAccount(accountName)
  // let getAccountPromise = steemAPI.sendAsync('condenser_api.get_accounts', [["vasko-1-test31"]])
  // steemAPI.sendAsync('condenser_api.get_accounts', [["kids-trail"]])//WORKING QUERY
    .then((resp) => {
      if(resp) {
        // console.log("Found account - response: ",resp)
        //
        // //TODO VALIDATE KEYS, EXTRACT FROM PASSWORD
        //
        // //CHECK IF BTS ACCOUNT EXISTS
        // let counter = 1;
        // let id = setInterval(()=>{
        //   if(counter===13){
        //     console.log("Count limit is exceeded. There is no account.");
        //     clearInterval(id);
        //   }
        //
        //   console.log("Get bts account counter: ",counter);
        //   let acc = ChainStore.getAccount(accountName);
        //   if(acc){
        //     console.log("Account: ",acc);
        //     console.log("---------------------------------");
        //     clearInterval(id)
        //
        //     const ownerKey = dsteem.PrivateKey.fromLogin(accountName, password, 'owner');
        //     const activeKey = dsteem.PrivateKey.fromLogin(accountName, password, 'active');
        //     const postingKey = dsteem.PrivateKey.fromLogin(accountName, password, 'posting');
        //     const memoKey = dsteem.PrivateKey.fromLogin(accountName, password, 'memo');
        //
        //
        //     const ownerAuth = {
        //       weight_threshold: 1,
        //       account_auths: [],
        //       key_auths: [[ownerKey.createPublic(), 1]],
        //     };
        //     const ownerAuthBTS = WalletDb.generateKeyFromPassword(accountName, 'owner', password);
        //     console.log("ownerKey: ",ownerKey);
        //     console.log("ownerKey.createPublic(): ",ownerKey.createPublic());
        //     console.log("ownerAuth: ",ownerAuth);
        //     console.log("ownerAuthBTS privKey: ",ownerAuthBTS.privKey);
        //     console.log("ownerAuthBTS pubKey: ",ownerAuthBTS.pubKey);
        //
        //     const activeAuth = {
        //       weight_threshold: 1,
        //       account_auths: [],
        //       key_auths: [[activeKey.createPublic(), 1]],
        //     };
        //     const activeAuthBTS = WalletDb.generateKeyFromPassword(accountName, 'active', password);
        //     console.log("activeKey: ",activeKey);
        //     console.log("activeKey.createPublic(): ",activeKey.createPublic());
        //     console.log("activeAuth: ",activeAuth);
        //     console.log("ownerAuthBTS privKey: ",activeAuthBTS.privKey);
        //     console.log("ownerAuthBTS pubKey: ",activeAuthBTS.pubKey);
        //
        //     const postingAuth = {
        //       weight_threshold: 1,
        //       account_auths: [],
        //       key_auths: [[postingKey.createPublic(), 1]],
        //     };
        //     const postingAuthBTS = WalletDb.generateKeyFromPassword(accountName, 'posting', password);
        //     console.log("postingKey: ",postingKey);
        //     console.log("postingKey.createPublic(): ",postingKey.createPublic());
        //     console.log("postingAuth: ",postingAuth);
        //     console.log("postingAuthBTS privKey: ",postingAuthBTS.privKey);
        //     console.log("postingAuthBTS pubKey: ",postingAuthBTS.pubKey);
        //
        //   }
        //   console.log("=================================");
        //   counter++;
        // },400);

      } else {
        console.log("There is no such account: ",resp);
      }
    })
    .catch((err)=>{
      console.log("OK ERROR: ",err);

      //TODO VALIDATE KEYS, EXTRACT FROM PASSWORD

      //CHECK IF BTS ACCOUNT EXISTS
      let counter = 1;
      let id = setInterval(()=>{
        if(counter===13){
          console.log("Count limit is exceeded. There is no account.");
          clearInterval(id);
        }

        console.log("Get bts account counter: ",counter);
        // let acc = ChainStore.getAccount(accountName);
        // if(acc){
        //   console.log("Account: ",acc);
        //   console.log("---------------------------------");
        //   clearInterval(id);
        //
        //   const ownerKey = dsteem.PrivateKey.fromLogin(accountName, password, 'owner');
        //   const activeKey = dsteem.PrivateKey.fromLogin(accountName, password, 'active');
        //   const postingKey = dsteem.PrivateKey.fromLogin(accountName, password, 'posting');
        //   const memoKey = dsteem.PrivateKey.fromLogin(accountName, password, 'memo');
        //
        //   const ownerAuthBTS = WalletDb.generateKeyFromPassword(accountName, 'owner', password);
        //   const activeAuthBTS = WalletDb.generateKeyFromPassword(accountName, 'active', password);
        //   const postingAuthBTS = WalletDb.generateKeyFromPassword(accountName, 'posting', password);
        //   // const memoAuthBTS = WalletDb.generateKeyFromPassword(accountName, 'memo', password);
        //   //const memoKeyBTS = memoAuthBTS.pubKey;
        //   /*
        //   console.log("ownerKey.createPublic(): ",ownerKey.createPublic("BTS"));
        //   console.log("ownerKey.createPublic().key: ",ownerKey.createPublic("BTS").key);
        //   console.log("ownerKey: ",ownerKey);
        //   console.log("ownerAuthBTS privKey: ",ownerAuthBTS.privKey);
        //   console.log("ownerAuthBTS pubKey: ",ownerAuthBTS.pubKey);
        //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        //   console.log("activeKey: ",activeKey);
        //   console.log("activeKey.createPublic(): ",activeKey.createPublic("BTS"));
        //   console.log("activeKey.createPublic().key: ",activeKey.createPublic("BTS").key);
        //   console.log("activeAuthBTS privKey: ",activeAuthBTS.privKey);
        //   console.log("activeAuthBTS pubKey: ",activeAuthBTS.pubKey);
        //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        //   console.log("postingKey: ",postingKey);
        //   console.log("postingKey.createPublic(): ",postingKey.createPublic("BTS"));
        //   console.log("postingKey.createPublic().key: ",postingKey.createPublic("BTS").key);
        //   console.log("postingAuthBTS privKey: ",postingAuthBTS.privKey);
        //   console.log("postingAuthBTS pubKey: ",postingAuthBTS.pubKey);
        //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        //   */
        //
        //
        //   const creator = 'banter';
        //   const newName = accountName;//'vasko-1-test30';
        //   const json_meta = '';
        //   const owner = ownerAuthBTS.pubKey;
        //   const active = activeAuthBTS.pubKey;
        //   const posting = postingAuthBTS.pubKey;//'BTS'+postingKey.createPublic().key;//activeAuthBTS.pubKey;
        //   const memo = activeAuthBTS.pubKey;
        //   const broadcast = true;
        //
        //   const params = [creator, newName, json_meta, owner, active, posting, memo, broadcast];
        //
        //   console.log("Account creation PARAMs: ",params);
        //
        //   // const body2 = {
        //   //   jsonrpc: '2.0',
        //   //   params: [
        //   //     creator,
        //   //     newName,
        //   //     json_meta,
        //   //     ownerKey.createPublic("BTS"),
        //   //     activeKey.createPublic("BTS"),
        //   //     postingKey.createPublic("BTS"),
        //   //     memoKey.createPublic("BTS"),
        //   //     true
        //   //   ]
        //   // };const body_string2 = JSON.stringify(body2);
        //
        //   const body = {
        //     "jsonrpc": "2.0",
        //     "params": params
        //   };
        //   const body_string = JSON.stringify(body);
        //
        //
        //   // fetch( "http://localhost:3000/es-api/v0/ca",{
        //   fetch( endpoints.CREATE_ACCOUNT,{
        //     method:"POST",
        //     headers: new Headers( { "Accept": "application/json", "Content-Type":"application/json" } ),
        //     body: body_string
        //     //mode: "no-cors"
        //   }).then(
        //     data => {
        //       console.log("DATA: ", data)
        //       data.json()
        //         .then( json => {
        //           console.log("response json: ", json);
        //           //console.log("address: ", json.response.address);
        //           //console.log("asset: ", json.response.asset);
        //           if(json.response){
        //             return dispatch({
        //               type: TYPES.RGISTRATION_SUCCESS,
        //               payload: {res: json.response}
        //             })
        //           } else {
        //             return dispatch({
        //               type: TYPES.RGISTRATION_ERROR,
        //               payload: {res: json.error}
        //             })
        //           }
        //         }, error => {
        //             console.log( "error1: ",error  );
        //             return dispatch({
        //               type: TYPES.RGISTRATION_ERROR,
        //               payload: {}
        //             })
        //         })
        //     }, error => {
        //       console.log( "error2: ",error  );
        //       return dispatch({
        //         type: TYPES.RGISTRATION_ERROR,
        //         payload: {}
        //       })
        //     }).catch(err => {
        //       console.log("fetch error3:", err);
        //       return dispatch({
        //         type: TYPES.RGISTRATION_ERROR,
        //         payload: {}
        //       })
        //   });
        //   // return;
        //
        //   // steemAPI.sendAsync('call', [
        //   //   'condenser_api',
        //   //   'create_account_with_keys',
        //   //   params,
        //   // ]).then((res)=>{
        //   //   //debugger;
        //   //   console.log("CREATE ACCOUNT RESPONSE: ",res);
        //   //   //TODO Dispatch to reducer success
        //   //   //Call getAccounts for the new created account
        //   // }).catch((err)=>{
        //   //   //debugger;
        //   //   console.log("CREATE ACCOUNT ERROR: ",err);
        //   //   //TODO DISPATCH to reducer with error
        //   // });
        //
        // }

        console.log("=================================");
        counter++;
      },200);
    });

  //TODO CHECK KEYS HERE
  // if (!steemConnectAPI.options.accessToken) {
  //
  //
  //   promise = Promise.reject(new Error('There is not accessToken present'));
  // } else {
  //   promise = steemConnectAPI.me().catch(() => dispatch(loginError()));
  // }

  // return dispatch({
  //   type: TYPES.LOGIN_SUCCESS,
  //   payload: {
  //     getAccountPromise,
  //   }
  // }).catch(() => dispatch(loginError()));
};

