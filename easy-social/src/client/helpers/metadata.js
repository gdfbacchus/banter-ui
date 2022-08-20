import omit from 'lodash/omit';
import SteemConnect from '../steemConnectAPI';
import constants from '../../server/routes/common/constants.js'
const dsteem = require('dsteem');
// import WalletDb from "../account/loginBts/stores/WalletDb";

const getMetadata = () => SteemConnect.me().then(resp => resp.user_metadata);

export const saveSettingsMetadata = settings =>
  getMetadata()
    .then(metadata =>
      SteemConnect.updateUserMetadata({
        ...metadata,
        settings: {
          ...metadata.settings,
          ...settings,
        },
      }),
    )
    .then(resp => resp.user_metadata.settings);

export const setLocaleMetadata = locale =>
  getMetadata()
    .then(metadata =>
      SteemConnect.updateUserMetadata({
        ...metadata,
        locale,
      }),
    )
    .then(resp => resp.user_metadata.locale);

export const addDraftMetadata = draft =>
  getMetadata()
    .then(metadata =>
      SteemConnect.updateUserMetadata({
        ...metadata,
        drafts: {
          ...metadata.drafts,
          [draft.id]: draft.postData,
        },
      }),
    )
    .then(resp => resp.user_metadata.drafts[draft.id]);

export const deleteDraftMetadata = draftIds =>
  getMetadata()
    .then(metadata =>
      SteemConnect.updateUserMetadata({
        ...metadata,
        drafts: omit(metadata.drafts, draftIds),
      }),
    )
    .then(resp => resp.user_metadata.drafts);

export const toggleBookmarkMetadata = (id, author, permlink) =>
  getMetadata()
    .then(metadata =>
      SteemConnect.updateUserMetadata({
        ...metadata,
        bookmarks:
          metadata.bookmarks && metadata.bookmarks[id]
            ? omit(metadata.bookmarks, id)
            : { ...metadata.bookmarks, [id]: { id, author, permlink } },
      }),
    )
    .then(resp => resp.user_metadata.bookmarks);

export const saveNotificationsLastTimestamp = lastTimestamp =>
  getMetadata()
    .then(metadata =>
      SteemConnect.updateUserMetadata({
        ...metadata,
        notifications_last_timestamp: lastTimestamp,
      }),
    )
    .then(resp => resp.user_metadata.notifications_last_timestamp);

export default getMetadata;


export const broadcastProfileSettings = (dsteemClient, user, settings, userWifs) => {
  console.log('[BANTER] broadcastProfileSettings user: ', user)
  console.log('[BANTER] broadcastProfileSettings settings: ', settings)
  console.log('[BANTER] broadcastProfileSettings userWifs: ', userWifs)
  const { ownerWif } = userWifs;
  const privOwnerKey = dsteem.PrivateKey.from(ownerWif);

  const operations = [];
  const accountName = user.name;

  const newMetadata = {};
  // if(user.json_metadata) {
  //   parsedMetadata = JSON.parse(metaData);
  // } else {
  //   parsedMetadata = {};
  // }
  //
  //
  // //console.log("parsedMetadata 1: ",parsedMetadata);
  newMetadata.profile = settings;
  console.log("[BANTER] broadcastProfileSettings New metadata : ",newMetadata);

  const settingsOp = [
    'account_update',
    {
      account: accountName,
      owner: user.owner,
      active: user.active,
      posting: user.posting,
      memo_key: user.memo_key,
      json_metadata: JSON.stringify(newMetadata)
    },
  ];
  operations.push(settingsOp);
  console.log("[BANTER] broadcastProfileSettings operations : ", operations);

  // //BROADCAST MULTIPLE OPERATIONS
  return dsteemClient.broadcast.sendOperations(operations, privOwnerKey);
    // .then(resp => {
    //   console.log("[BANTER] broadcastProfileSettings dsteemClient.broadcast.sendOperations() -> resp : ",resp);
    //   return resp.user_metadata.settings
    // })
    // .catch((err) => {
    //   console.error("[BANTER] broadcastProfileSettings ERROR:: ",err);
    // })
};


