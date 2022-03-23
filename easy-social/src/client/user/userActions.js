import { createAction } from 'redux-actions';
import { getIsAuthenticated, getAuthenticatedUserName } from '../reducers';
import { getAllFollowing } from '../helpers/apiHelpers';
import { createAsyncActionType } from '../helpers/stateHelpers';

import { getAccountWithFollowingCount as getAccountWithFollowingCountAPI } from '../helpers/apiHelpers';

export const GET_ACCOUNT = createAsyncActionType('@users/GET_ACCOUNT');

const dsteem = require('dsteem');
// import WalletDb from "../account/loginBts/stores/WalletDb";

export const FOLLOW_USER = '@user/FOLLOW_USER';
export const FOLLOW_USER_START = '@user/FOLLOW_USER_START';
export const FOLLOW_USER_SUCCESS = '@user/FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_ERROR = '@user/FOLLOW_USER_ERROR';

export const followUser = username => (dispatch, getState, { dsteemClient }) => {

  const state = getState();


  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }
  const follower = getAuthenticatedUserName(state);

  var params = {
    required_auths: [],
    required_posting_auths: [follower],
    id: 'follow',
    json: JSON.stringify(['follow', { follower, following: username, what: ['blog'] }])
  };

  // const postingWif = getPostingWif(state.auth.user.posting.key_auths[0][0]);
  const postingWif = state.auth.postingWif;
  const operations = [['custom_json', params]];
  //console.log("followUser postingWif: ",postingWif);
  const privKey2 = dsteem.PrivateKey.from(postingWif);//That's Working
  //console.log("followUser privKey2 PrivateKey.from: ",privKey2);
  console.log("followUser Operations before send: ",operations);

  return dispatch({
    type: FOLLOW_USER,
    payload: {
      promise: dsteemClient.broadcast.sendOperations(operations, privKey2)
        .then(() => {
          dispatch({
            type: GET_ACCOUNT.ACTION,
            payload: getAccountWithFollowingCountAPI(state.auth.user.name),
            meta: { username: state.auth.user.name },
          })
        }
      )
        //steemConnectAPI.follow(getAuthenticatedUserName(state), username),
    },
    meta: {
      username,
    },
  });
};

const getPostingWif = (posting_pubk)=> {
  // const private_posting_key = WalletDb.getPrivateKey(posting_pubk);
  // const wifP = private_posting_key.toWif();
  // return wifP
};

export const UNFOLLOW_USER = '@user/UNFOLLOW_USER';
export const UNFOLLOW_USER_START = '@user/UNFOLLOW_USER_START';
export const UNFOLLOW_USER_SUCCESS = '@user/UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_ERROR = '@user/UNFOLLOW_USER_ERROR';

export const unfollowUser = username => (dispatch, getState, { dsteemClient }) => {
  const state = getState();

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }



  const unfollower = getAuthenticatedUserName(state);


   const params = {
     required_auths: [],
     required_posting_auths: [unfollower],
     id: 'follow',
     json: JSON.stringify(['follow', { follower: unfollower, following: username, what: [] }])
   };


  const postingWif = getPostingWif(state.auth.user.posting.key_auths[0][0]);
  const operations = [['custom_json', params]];
  //console.log("unfollowUser postingWif: ",postingWif);
  const privKey2 = dsteem.PrivateKey.from(postingWif);//That's Working
  //console.log("unfollowUser privKey2 PrivateKey.from: ",privKey2);
  console.log("unfollowUser Operations before send: ",operations);

  return dispatch({
    type: UNFOLLOW_USER,
    payload: {
      promise: dsteemClient.broadcast.sendOperations(operations, privKey2)
        .then( () => {
          dispatch({
            type: GET_ACCOUNT.ACTION,
            payload: getAccountWithFollowingCountAPI(state.auth.user.name),
            meta: { username: state.auth.user.name },
          })
        }
      )

        // steemConnectAPI.unfollow(getAuthenticatedUserName(state), username),
    },
    meta: {
      username,
    },
  });
};

export const GET_FOLLOWING = '@user/GET_FOLLOWING';
export const GET_FOLLOWING_START = '@user/GET_FOLLOWING_START';
export const GET_FOLLOWING_SUCCESS = '@user/GET_FOLLOWING_SUCCESS';
export const GET_FOLLOWING_ERROR = '@user/GET_FOLLOWING_ERROR';

export const getFollowing = username => (dispatch, getState) => {
  //console.log("Call getFollowing GET_FOLLOWING Action. username["+username+"]");
  const state = getState();

  if (!username && !getIsAuthenticated(state)) {
    return dispatch({ type: GET_FOLLOWING_ERROR });
  }

  const targetUsername = username || getAuthenticatedUserName(state);

  return dispatch({
    type: GET_FOLLOWING,
    meta: targetUsername,
    payload: {
      promise: getAllFollowing(targetUsername),
    },
  });
};

export const UPDATE_RECOMMENDATIONS = '@user/UPDATE_RECOMMENDATIONS';
export const updateRecommendations = createAction(UPDATE_RECOMMENDATIONS);

export const GET_NOTIFICATIONS = createAsyncActionType('@user/GET_NOTIFICATIONS');

export const getNotifications = username => (dispatch, getState, { busyAPI }) => {
  const state = getState();

  if (!username && !getIsAuthenticated(state)) {
    return dispatch({ type: GET_NOTIFICATIONS.ERROR });
  }

  const targetUsername = username || getAuthenticatedUserName(state);

  return dispatch({
    type: GET_NOTIFICATIONS.ACTION,
    meta: targetUsername,
    payload: {
      promise: Promise.resolve()//busyAPI.sendAsync('get_notifications', [targetUsername]),
    },
  });
};
