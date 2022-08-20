import { createAction } from 'redux-actions';

import { saveSettingsMetadata, broadcastProfileSettings } from '../helpers/metadata';

export const SAVE_SETTINGS = '@app/SAVE_SETTINGS';
export const SAVE_SETTINGS_START = '@app/SAVE_SETTINGS_START';
export const SAVE_SETTINGS_SUCCESS = '@app/SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_ERROR = '@app/SAVE_SETTINGS_ERROR';

import { createAsyncActionType } from '../helpers/stateHelpers';
import { getAccountWithFollowingCount as getAccountWithFollowingCountAPI } from '../helpers/apiHelpers';
import dsteemClient from '../dsteemAPI';
import { getAuthenticatedUserWifs } from '../reducers';

export const GET_ACCOUNT = createAsyncActionType('@users/GET_ACCOUNT');

const ACTION_TYPES = {
  SAVE_PROFILE_SETTINGS: "SAVE_PROFILE_SETTINGS",
  UPDATE_PROFILE_SETTINGS: "UPDATE_PROFILE_SETTINGS",
  UPDATE_PROFILE: "UPDATE_PROFILE",
  START_SAVE_SETTINGS: "START_SAVE_SETTINGS",
  RESET_PROFILE_SETTINGS_STATUS: "RESET_PROFILE_SETTINGS_STATUS",
  SAVING_PROFILE_SETTINGS_COMPLETED: "SAVING_PROFILE_SETTINGS_COMPLETED"
};

export const saveSettings = settings => dispatch =>
  dispatch({
    type: SAVE_SETTINGS,
    payload: {
      promise: saveSettingsMetadata(settings),
    },
  });

export const startSavingProfileSettings = () => dispatch =>
  dispatch({
    type: ACTION_TYPES.START_SAVE_SETTINGS,
    payload: {},
  });
export const resetProfileSettingsStatus = () => dispatch =>
  dispatch({
    type: ACTION_TYPES.RESET_PROFILE_SETTINGS_STATUS,
    payload: {},
  });

export function saveProfileSettings(settings) {
  // requiredFields.forEach(field => {
  //   assert(settings[field] != null, `Developer Error: Missing required field ${field}`);
  // });
  // console.log("Changed Settings : ",settings);

  console.log("[BANTER] saveProfileSettings ACTION settings: ",settings);


  // return (dispatch, getState, { dsteemClient }) => {
  return (dispatch, getState) => {
    const state = getState();
    const user = state.auth.user;
    const userWifs = getAuthenticatedUserWifs(state);
    console.log("[BANTER] saveProfileSettings ACTION state.auth: ",state.auth);
    console.log("[BANTER] saveProfileSettings ACTION userWifs: ", userWifs);

    dispatch({
      type: ACTION_TYPES.SAVE_PROFILE_SETTINGS,
      payload: {
        promise:
          broadcastProfileSettings(
            dsteemClient,
            user,
            settings,
            userWifs,
          ).then(result => {
            // dispatch(setPostCommentSuccessStatus());
            console.log("[BANTER] Save Profile Settings SUCCESS response 1: ",result);

            //TODO Fetch account withthe new settings



            return dsteemClient.database.call('get_accounts', [[user.name]]).then((resp)=>{
              // console.log("RESP: ",resp)
              // console.log("RESP[0]: ",resp[0])
              dispatch({
                type: ACTION_TYPES.UPDATE_PROFILE_SETTINGS,
                payload: resp[0]
              });

              dispatch({
                type: GET_ACCOUNT.ACTION,
                payload: getAccountWithFollowingCountAPI(user.name),
                meta: { username: user.name },
              });

              dispatch({
                type: ACTION_TYPES.SAVING_PROFILE_SETTINGS_COMPLETED,
                payload: {status: 'success'}
              })

            });

          }).catch((err)=>{
            dispatch({
              type: ACTION_TYPES.SAVING_PROFILE_SETTINGS_COMPLETED,
              payload: {status: 'error'}
            });
            console.error("Save Profile Settings ERROR: ",err);
          })
      },
    });
  };
}



export const SET_LOCALE = '@app/SET_LOCALE';

export const setLocale = createAction(SET_LOCALE);
