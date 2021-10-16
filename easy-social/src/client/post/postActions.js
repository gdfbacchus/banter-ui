import { createAsyncActionType } from '../helpers/stateHelpers';
const dsteem = require('dsteem');
export const GET_CONTENT = createAsyncActionType('@post/GET_CONTENT');


export const LIKE_POST = '@post/LIKE_POST';
export const LIKE_POST_START = '@post/LIKE_POST_START';
export const LIKE_POST_SUCCESS = '@post/LIKE_POST_SUCCESS';
export const LIKE_POST_ERROR = '@post/LIKE_POST_ERROR';

const TYPES = {
  POST_COMMENT_SENDING_STATUS : {
    ERROR: 'statusSendingError',
    SUCCESS: 'statusSendingSuccess',
    RESET: 'statusSendingReset'
  }
};

export const setPostCommentSuccessStatus = () => (
  dispatch,
  getState
) => {
  return dispatch({
    type: TYPES.POST_COMMENT_SENDING_STATUS.SUCCESS,
    payload: {}
  });
};
export const setPostCommentErrorStatus = () => (
  dispatch,
  getState
) => {
  return dispatch({
    type: TYPES.POST_COMMENT_SENDING_STATUS.ERROR,
    payload: {}
  });
};
export const postCommentResetStatus = () => (
  dispatch,
  getState
) => {
  return dispatch({
    type: TYPES.POST_COMMENT_SENDING_STATUS.RESET,
    payload: {}
  });
};

export const getContent = (author, permlink, afterLike) => (dispatch, getState, { steemAPI }) => {
  if (!author || !permlink) {
    return null;
  }

  return dispatch({
    type: GET_CONTENT.ACTION,
    payload: {
      promise: steemAPI.sendAsync('condenser_api.get_content', [author, permlink]).then(res => {
        if (res.id === 0) throw new Error('There is no such post');
        return res;
      }),
    },
    meta: {
      author,
      permlink,
      afterLike,
    },
  }).catch(() => {});
};

export const votePost = (postId, author, permlink, weight = 10000, postingWif) => (
  dispatch,
  getState,
  { dsteemClient },
) => {
  const { auth, posts } = getState();
  if (!auth.isAuthenticated) {
    return null;
  }

  const post = posts.list[postId];
  const voter = auth.user.name;

  const params = {
    voter,
    author: post.author,
    permlink: post.permlink,
    weight
  };

  const operations = [['vote', params]];
  // console.log("votePost postingWif: ",postingWif);
  const privKey2 = dsteem.PrivateKey.from(postingWif);//That's Working
  // console.log("privKey2 PrivateKey.from: ",privKey2);
  console.log("VOTE POST Operations before send: ",operations);
  return dispatch({
    type: LIKE_POST,
    payload: {
      promise:  dsteemClient.broadcast.sendOperations(operations, privKey2).then(res => {

        //steemConnectAPI.vote(voter, post.author, post.permlink, weight).then(res => {
        // if (window.analytics) {
        //   window.analytics.track('Vote', {
        //     category: 'vote',
        //     label: 'submit',
        //     value: 1,
        //   });
        // }

        // Delay to make sure you get the latest data (unknown issue with API)
        setTimeout(() => dispatch(getContent(post.author, post.permlink, true)), 1000);
        return res;
      }),
    },
    meta: { postId, voter, weight },
  });
};
