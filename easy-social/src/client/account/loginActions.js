import { createAction } from 'redux-actions';
// import {Apis} from "bitsharesjs-ws";
// import {ChainStore} from "bitsharesjs";
// import WalletDb from "./loginBts/stores/WalletDb";

// import { getAllFollowing } from '../helpers/apiHelpers';
import dsteemClient from '../dsteemAPI';
import {LOGIN_ERROR} from "../auth/authActions";

const dsteem = require('dsteem');


const TYPES = {
  LOGIN_START: '@es_auth/LOGIN_START',
  LOGIN_SUCCESS: '@auth/LOGIN_SUCCESS',
  LOGIN_ERROR: '@auth/LOGIN_ERROR'
};

const GET_FOLLOWING = '@user/GET_FOLLOWING';
const loginError = createAction(TYPES.LOGIN_ERROR);

function isValidAccount (account, accountName, password) {
  let isValid = false;

  const addressPrefix = 'BTS';
  const ownerKeyFromAccount = account.owner.key_auths[0][0];
  const activeKeyFromAccount = account.active.key_auths[0][0];
  const postingKeyFromAccount = account.posting.key_auths[0][0];
  const memoKeyFromAccount = account.memo_key;
  console.log("[BANTER] -------------------------------------------------------------------------");
  console.log("[BANTER] owner pub key : ", ownerKeyFromAccount);
  console.log("[BANTER] active pub key : ", activeKeyFromAccount);
  console.log("[BANTER] posting pub key : ", postingKeyFromAccount);
  console.log("[BANTER] memo pub key : ", memoKeyFromAccount);
  const ownerKey = dsteem.PrivateKey.fromLogin(accountName, password, 'owner');
  const activeKey = dsteem.PrivateKey.fromLogin(accountName, password, 'active');
  const postingKey = dsteem.PrivateKey.fromLogin(accountName, password, 'posting');
  const memoKey = dsteem.PrivateKey.fromLogin(accountName, password, 'memo').createPublic(addressPrefix).toString();;

  const ownerKeyFromPrivateKey = ownerKey.createPublic(addressPrefix).toString();
  const activeKeyFromPrivateKey = activeKey.createPublic(addressPrefix).toString();
  const postingKeyFromPrivateKey = postingKey.createPublic(addressPrefix).toString();

  console.log("[BANTER] -------------------------------------------------------------------------");
  console.log("[BANTER] generated owner pub key : ", ownerKeyFromPrivateKey);
  console.log("[BANTER] generated active pub key : ", activeKeyFromPrivateKey);
  console.log("[BANTER] generated posting pub key : ", postingKeyFromPrivateKey);
  console.log("[BANTER] generated memo pub key : ", memoKey);
  console.log("[BANTER] -------------------------------------------------------------------------");

  console.log("[BANTER] ownerKeyFromAccount===ownerKeyFromPrivateKey : ", ownerKeyFromAccount===ownerKeyFromPrivateKey);
  console.log("[BANTER] activeKeyFromAccount===activeKeyFromPrivateKey : ", activeKeyFromAccount===activeKeyFromPrivateKey);
  console.log("[BANTER] postingKeyFromAccount===postingKeyFromPrivateKey : ", postingKeyFromAccount===postingKeyFromPrivateKey);
  console.log("[BANTER] memoKeyFromAccount===memoKey : ", memoKeyFromAccount===memoKey);
  console.log("[BANTER] -------------------------------------------------------------------------");
  if (ownerKeyFromAccount===ownerKeyFromPrivateKey
      && activeKeyFromAccount===activeKeyFromPrivateKey
      && postingKeyFromAccount===postingKeyFromPrivateKey
      && memoKeyFromAccount===memoKey
    ) {
    isValid = true;
  }
  return isValid;
}

export const login = (accountName, password) => (dispatch, getState, { steemAPI }) => {
  console.log("Call Login Action");

  dsteemClient.database.call('get_accounts', [[accountName]])
    .then((_account) => {
      console.log(`[BANTER] login _account search:`, _account);
      if(_account.length===0) {
        console.log("[BANTER] login - There is no such ES account: ",_account);
      }
      else if(_account.length === 1) {
        console.log("[BANTER] login - Found ES account - response: ",_account)
        localStorage.setItem('loginAccount', _account[0]);

        const isValidAcc = isValidAccount(_account[0], accountName, password);
        if (isValidAcc) {
          return dispatch({
              type: TYPES.LOGIN_SUCCESS,
              payload: {account: _account[0]},

          });
        } else {
          return dispatch({
            type: TYPES.LOGIN_ERROR,
            payload: {account: _account[0]},

          });

        }
      }
    })
    .catch((err)=>{
      console.log("[BANTER] GET ACCOUNTS ERROR: ",err)
    });

};
