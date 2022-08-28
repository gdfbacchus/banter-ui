import { createAction } from 'redux-actions';
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

  const postingWif = postingKey.toString();
  const activeWif = activeKey.toString();
  const ownerWif  = ownerKey.toString();
  const memoWif = dsteem.PrivateKey.fromLogin(accountName, password, 'memo').toString();

  if (ownerKeyFromAccount===ownerKeyFromPrivateKey
      && activeKeyFromAccount===activeKeyFromPrivateKey
      && postingKeyFromAccount===postingKeyFromPrivateKey
      && memoKeyFromAccount===memoKey
    ) {
    isValid = true;
  }
  return {
    isValid,
    postingWif,
    activeWif,
    ownerWif,
    memoWif,
  };
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
        if (isValidAcc.isValid) {
          const  { postingWif, activeWif, ownerWif, memoWif } = isValidAcc;
          return dispatch({
              type: TYPES.LOGIN_SUCCESS,
              payload: {
                account: _account[0],
                wifs: {
                  postingWif,
                  activeWif,
                  ownerWif,
                  memoWif,
                }
              },

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
