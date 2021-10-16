import omit from 'lodash/omit';
import SteemConnect from '../steemConnectAPI';
const dsteem = require('dsteem');
import WalletDb from "../account/loginBts/stores/WalletDb";

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


export const broadcastProfileSettings = (dsteemClient, user, settings) => {
  const operations = [];

  const accountName = user.name;
  const active_pubk = user.active.key_auths[0][0];
  const memo_public_key = user.memo_key;
  const private_active_key = WalletDb.getPrivateKey(active_pubk);
  const activeWif = private_active_key.toWif();
  //console.log("saveProfileSettings user: ",user);
  // console.log("saveProfileSettings memo_public_key: ",memo_public_key);
  // console.log("saveProfileSettings accountName: ",accountName);
  // console.log("PUBLIC ACTIVE KEY: ",active_pubk);
  // console.log("PRIVATE ACTIVE KEY activeWif : ", activeWif);

  let newMetadata = {};
  // if(user.json_metadata) {
  //   parsedMetadata = JSON.parse(metaData);
  // } else {
  //   parsedMetadata = {};
  // }


  //console.log("parsedMetadata 1: ",parsedMetadata);
  newMetadata['profile'] = settings;
  console.log("New metadata : ",newMetadata);
  //console.log("metaData: ",metaData);
  //console.log("parsedMetadata 2: ",parsedMetadata);

  const settingsOp = [
    'account_update',
    {
      account: accountName,
      // owner: optional(authority),
      // active: optional(authority),
      // posting: optional(authority),
      memo_key: memo_public_key,
      json_metadata: JSON.stringify(newMetadata)
    },
  ];
  operations.push(settingsOp);


  // console.log("POSTING WIF: ",postingWif);
  // const privKey1 = dsteem.PrivateKey.fromString(postingWif);//That's Working
  // console.log("PrivateKey.fromString: ",postingWif);

  const privKey2 = dsteem.PrivateKey.from(activeWif);//That's Working
  //console.log("PrivateKey.from: ",activeWif);
  //console.log("POST Operations before send: ",operations);

  //BROADCAST MULTIPLE OPERATIONS
  return dsteemClient.broadcast.sendOperations(operations, privKey2);

  //.then(resp => resp.user_metadata.settings);
};


