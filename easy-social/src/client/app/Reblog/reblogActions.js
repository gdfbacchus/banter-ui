import store from 'store';
import { createAction } from 'redux-actions';

const dsteem = require('dsteem');
// import WalletDb from "../../account/loginBts/stores/WalletDb";

export const REBLOG_POST = '@reblog/REBLOG_POST';
export const REBLOG_POST_START = '@reblog/REBLOG_POST_START';
export const REBLOG_POST_SUCCESS = '@reblog/REBLOG_POST_SUCCESS';
export const REBLOG_POST_ERROR = '@reblog/REBLOG_POST_ERROR';

export const GET_REBLOGGED_LIST = '@reblog/GET_REBLOGGED_LIST';
const getRebloggedListAction = createAction(GET_REBLOGGED_LIST);

const storePostId = postId => {
  const reblogged = store.get('reblogged') || [];
  const newReblogged = [...reblogged, postId];
  store.set('reblogged', newReblogged);
  return newReblogged;
};

export const reblog = postId => (dispatch, getState, { dsteemClient }) => {
  const { auth, posts } = getState();
  const post = posts.list[postId];

  var params = {
    required_auths: [],
    required_posting_auths: [auth.user.name],
    id: 'follow',
    json: JSON.stringify(['reblog', {
      account: auth.user.name,
      author: post.author,
      permlink: post.permlink
    }])
  };

  const postingWif = auth.postingWif;
  const operations = [['custom_json', params]];
  const privKey2 = dsteem.PrivateKey.from(postingWif);//That's Working

  dispatch({
    type: REBLOG_POST,
    payload: {
      promise: dsteemClient.broadcast.sendOperations(operations, privKey2).then(result => {
        const list = storePostId(postId);
        dispatch(getRebloggedListAction(list));

        // if (window.analytics) {
        //   window.analytics.track('Reblog', {
        //     category: 'reblog',
        //     label: 'submit',
        //     value: 2,
        //   });
        // }

        return result;
      }),
    },
    meta: { postId },
  });
};

export const getRebloggedList = () => dispatch => {
  const list = store.get('reblogged') || [];
  dispatch(getRebloggedListAction(list));
};
