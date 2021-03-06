import { createAction } from 'redux-actions';
import { createCommentPermlink, getBodyPatchIfSmaller } from '../vendor/steemitHelpers';
import { notify } from '../app/Notification/notificationActions';
import { jsonParse } from '../helpers/formatter';
import { createPostMetadata } from '../helpers/postHelpers';
import {
  setPostCommentSuccessStatus,
  setPostCommentErrorStatus
} from '../post/postActions';
const dsteem = require('dsteem');
import WalletDb from "../account/loginBts/stores/WalletDb";
export const GET_COMMENTS = 'GET_COMMENTS';
export const GET_COMMENTS_START = 'GET_COMMENTS_START';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';
export const GET_COMMENTS_ERROR = 'GET_COMMENTS_ERROR';

export const SEND_COMMENT = 'SEND_COMMENT';
export const SEND_COMMENT_START = 'SEND_COMMENT_START';
export const SEND_COMMENT_SUCCESS = 'SEND_COMMENT_SUCCESS';
export const SEND_COMMENT_ERROR = 'SEND_COMMENT_ERROR';

export const LIKE_COMMENT = '@comments/LIKE_COMMENT';
export const LIKE_COMMENT_START = '@comments/LIKE_COMMENT_START';
export const LIKE_COMMENT_SUCCESS = '@comments/LIKE_COMMENT_SUCCESS';
export const LIKE_COMMENT_ERROR = '@comments/LIKE_COMMENT_ERROR';

export const RELOAD_EXISTING_COMMENT = '@comments/RELOAD_EXISTING_COMMENT';
export const reloadExistingComment = createAction(RELOAD_EXISTING_COMMENT, undefined, data => ({
  commentId: data.id,
}));

const getRootCommentsList = apiRes =>
  Object.keys(apiRes.content)
    .filter(commentKey => apiRes.content[commentKey].depth === 1)
    .map(commentKey => apiRes.content[commentKey].id);

const getCommentsChildrenLists = apiRes => {
  const listsById = {};
  Object.keys(apiRes.content).forEach(commentKey => {
    listsById[apiRes.content[commentKey].id] = apiRes.content[commentKey].replies.map(
      childKey => apiRes.content[childKey].id,
    );
  });

  return listsById;
};

/**
 * Fetches comments from blockchain.
 * @param {number} postId Id of post to fetch comments from
 * @param {boolean} reload If set to true isFetching won't be set to true
 * preventing loading icon to be dispalyed
 * @param {object} focusedComment Object with author and permlink to which focus after loading
 */
export const getComments = (postId, reload = false, focusedComment = undefined) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  const { posts, comments } = getState();

  const content = posts.list[postId] || comments.comments[postId];

  const { category, author, permlink } = content;

  dispatch({
    type: GET_COMMENTS,
    payload: {
      promise: steemAPI
        .sendAsync('condenser_api.get_state', [`/${category}/@${author}/${permlink}`])
        .then(apiRes => ({
          rootCommentsList: getRootCommentsList(apiRes),
          commentsChildrenList: getCommentsChildrenLists(apiRes),
          content: apiRes.content,
        })),
    },
    meta: {
      id: postId,
      reload,
      focusedComment,
    },
  });
};

export const sendComment = (parentPost, body, isUpdating = false, originalComment) => (
  dispatch,
  getState,
  { dsteemClient },
) => {
  const { category, id, permlink: parentPermlink, author: parentAuthor } = parentPost;
  const { auth } = getState();

  if (!auth.isAuthenticated) {
    return dispatch(notify('You have to be logged in to comment', 'error'));
  }

  if (!body || !body.length) {
    return dispatch(notify("Message can't be empty", 'error'));
  }

  const author = auth.user.name;
  const permlink = isUpdating
    ? originalComment.permlink
    : createCommentPermlink(parentAuthor, parentPermlink);

  const jsonMetadata = createPostMetadata(
    body,
    [category],
    isUpdating && jsonParse(originalComment.json_metadata),
  );

  const newBody = isUpdating ? getBodyPatchIfSmaller(originalComment.body, body) : body;


  var params = {
    parent_author: parentAuthor,
    parent_permlink: parentPermlink,
    author: author,
    permlink: permlink,
    title: '',
    body: newBody,
    json_metadata: JSON.stringify(jsonMetadata)
  };
  const postingWif = getPostingWif(auth.user.posting.key_auths[0][0]);
  const operations = [['comment', params]];
  //console.log("sendComment postingWif: ",postingWif);
  const privKey2 = dsteem.PrivateKey.from(postingWif);//That's Working
  //console.log("sendComment privKey2 PrivateKey.from: ",privKey2);
  console.log("COMMENT Operations before send: ",operations);

  return dispatch({
    type: SEND_COMMENT,
    payload: {
      promise: dsteemClient.broadcast.sendOperations(operations, privKey2).then(resp => {
        console.log("Comment response: ",resp);
        dispatch(setPostCommentSuccessStatus());
        const focusedComment = {
          author: resp.result.operations[0][1].author,
          permlink: resp.result.operations[0][1].permlink,
        };
        dispatch(getComments(id, true, focusedComment));

        // if (window.analytics) {
        //   window.analytics.track('Comment', {
        //     category: 'comment',
        //     label: 'submit',
        //     value: 3,
        //   });
        // }
      }).catch(()=>{
        dispatch(setPostCommentErrorStatus());
      }),

        // steemConnectAPI
        // .comment(parentAuthor, parentPermlink, author, permlink, '', newBody, jsonMetadata)
        // .then(resp => {
        //   const focusedComment = {
        //     author: resp.result.operations[0][1].author,
        //     permlink: resp.result.operations[0][1].permlink,
        //   };
        //   dispatch(getComments(id, true, focusedComment));
        //
        //   if (window.analytics) {
        //     window.analytics.track('Comment', {
        //       category: 'comment',
        //       label: 'submit',
        //       value: 3,
        //     });
        //   }
        // }),
    },
    meta: {
      parentId: parentPost.id,
      isEditing: false,
      isReplyToComment: parentPost.id !== id,
    },
  });
};

const getPostingWif = (posting_pubk)=> {
  //console.log("LIKE POST PUBLIC POSTING KEY: ",posting_pubk);
  const private_posting_key = WalletDb.getPrivateKey(posting_pubk);
  const wifP = private_posting_key.toWif();
  //console.log("LIKE POST PRIVATE POSTING KEY wifP : ", wifP);
  return wifP
};

export const likeComment = (commentId, weight = 10000, vote = 'like', retryCount = 0) => (
  dispatch,
  getState,
  { steemAPI, dsteemClient },
) => {
  const { auth, comments } = getState();

  if (!auth.isAuthenticated) {
    return;
  }

  const voter = auth.user.name;
  const { author, permlink } = comments.comments[commentId];



  const params = {
    voter,
    author,
    permlink,
    weight
  };

  const operations = [['vote', params]];
  const postingWif = getPostingWif(auth.user.posting.key_auths[0][0]);

  //console.log("sendComment postingWif: ",postingWif);
  const privKey2 = dsteem.PrivateKey.from(postingWif);//That's Working
  //console.log("sendComment privKey2 PrivateKey.from: ",privKey2);
  console.log("VOTE COMMENT Operations before send: ",operations);


  //TODO CHANGE THIS METHOD
  dispatch({
    type: LIKE_COMMENT,
    payload: {
      promise:  dsteemClient.broadcast.sendOperations(operations, privKey2).then(res => {
      // promise: steemConnectAPI.vote(voter, author, permlink, weight).then(res => {
      //   // reload comment data to fetch payout after vote
      //   steemAPI.sendAsync('condenser_api.get_content', [author, permlink]).then(data => {
      //     dispatch(reloadExistingComment(data));
      //     return data;
      //   });
      //   return res;
      // }),
        // reload comment data to fetch payout after vote
        steemAPI.sendAsync('condenser_api.get_content', [author, permlink]).then(data => {
          dispatch(reloadExistingComment(data));
          return data;
        });
        return res;
      }),
    },
    meta: { commentId, voter, weight, vote, isRetry: retryCount > 0 },
  }).catch(err => {
    if (err.res && err.res.status === 500 && retryCount <= 5) {
      dispatch(likeComment(commentId, weight, vote, retryCount + 1));
    }
  });
};
/*
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
*/
