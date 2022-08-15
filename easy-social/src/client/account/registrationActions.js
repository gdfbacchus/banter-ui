
import { createAction } from 'redux-actions';
// import {Apis} from "bitsharesjs-ws";
// import {ChainStore, PrivateKey, key, Aes} from "bitsharesjs";
// import WalletDb from "./loginBts/stores/WalletDb";
const dsteem = require('dsteem');
import {getAccount} from "../helpers/apiHelpers"
import endpoints from "../costants/endpoints";
// import dsteemClient from '../dsteemAPI';

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


export const isAvailableAccount = (accountName) => (dispatch, getState, { steemAPI, dsteemClient }) => {
  let getAccountPromise = steemAPI.sendAsync('condenser_api.get_accounts', [[accountName]])
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
}

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

export  const register = (accountName, password) => (dispatch, getState, { steemAPI,  }) => {
  console.log("Call Registration Action");
  const opts = {
    addressPrefix: 'BTS',
    chainId: '9e42d42746f9f0ae04ce62e1c1bc4901db89c4b805386a23dd73ea202b1cae14'
  };
  const banterNodeUrl = process.env.STEEMJS_URL || 'https://node.banternetwork.io';
  const dsteemClient = new dsteem.Client(banterNodeUrl,opts);

  const ownerKey = dsteem.PrivateKey.fromLogin(accountName, password, 'owner');
  const activeKey = dsteem.PrivateKey.fromLogin(accountName, password, 'active');
  const postingKey = dsteem.PrivateKey.fromLogin(accountName, password, 'posting');
  const memoKey = dsteem.PrivateKey.fromLogin(accountName, password, 'memo').createPublic(opts.addressPrefix);

  const ownerAuth = {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[ownerKey.createPublic(opts.addressPrefix), 1]],
  };
  const activeAuth = {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[activeKey.createPublic(opts.addressPrefix), 1]],
  };
  const postingAuth = {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[postingKey.createPublic(opts.addressPrefix), 1]],
  };

  console.log("ownerKey.createPublic(): ",ownerKey.createPublic(opts.addressPrefix));
  console.log("ownerKey.createPublic().key: ",ownerKey.createPublic(opts.addressPrefix).key);
  console.log("ownerKey: ",ownerKey);
  console.log("ownerAuth: ",ownerAuth);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log("activeKey: ",activeKey);
  console.log("activeAuth: ",activeAuth);
  console.log("activeKey.createPublic(): ",activeKey.createPublic(opts.addressPrefix));
  console.log("activeKey.createPublic().key: ",activeKey.createPublic(opts.addressPrefix).key);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log("postingKey: ",postingKey);
  console.log("postingAuth: ",postingAuth);
  console.log("postingKey.createPublic(): ",postingKey.createPublic(opts.addressPrefix));
  console.log("postingKey.createPublic().key: ",postingKey.createPublic(opts.addressPrefix).key);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  console.log("memoKey: ",memoKey);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

  // const creator = 'init1';
  const creator = 'banter';
  const newName = accountName;;
  const json_meta = '';
  const owner = ownerAuth;
  const active = activeAuth;
  const posting = postingAuth;
  const memo = memoKey;
  const broadcast = true;
  const fee = '5.000 BTRS';

  const op = [
    'account_create',
    {
      creator,
      new_account_name: newName,
      json_metadata: json_meta,
      owner,
      active,
      posting,
      memo_key: memo,
      broadcast,
      fee,
    }
  ];

  const privateKey = dsteem.PrivateKey.from('5K5f47eZWTy3X7oeDdFNa3U4XFicq2NDFFu1ZRaG6YhFGqbGV9W');// active private key


  console.log("Account creation opts: ",op);

  dsteemClient.broadcast.sendOperations([op], privateKey)
    .then(
      // function(result) {
      //   console.log("[BANTER] CREATE ACCOUNT RESPONSE: ", result);
      //
      // },
      // function(error) {
      //   console.error("[BANTER] CREATE ACCOUNT ERROR: ", error);
      // }


      data => {
        console.log("[BANTER] CREATE ACCOUNT RESPONSE DATA: ", data);

        dsteemClient.database.call('get_accounts', [[accountName]])
          .then((_account) => {
            console.log(`[BANTER] _account search:`, _account);
            if(_account.length===0) {
              console.log("[BANTER] There is no such ES account: ",_account);
            }
            else if(_account.length === 1) {
              console.log("[BANTER] Found ES account - response: ",_account)
              localStorage.setItem('registerdAccount', _account[0]);
              return Promise.all([
                dispatch({
                  type: TYPES.RGISTRATION_SUCCESS,
                  payload: {res: data, registeredAccount: _account[0]}
                }),
              ])

            }
          })
          .catch((err)=>{
            console.log("[BANTER] GET ACCOUNTS ERROR: ",err)
          });
      },
      error => {
        console.log( "[BANTER] CREATE ACCOUNT ERROR2: ",error  );
        return dispatch({
          type: TYPES.RGISTRATION_ERROR,
          payload: {}
        })
      })
    .catch(err => {
      console.log("[BANTER] CREATE ACCOUNT ERROR3: ", err);
      return dispatch({
        type: TYPES.RGISTRATION_ERROR,
        payload: {}
      });
    });

};

