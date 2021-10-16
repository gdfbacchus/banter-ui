import _ from 'lodash';
import * as actions from './usersActions';

const initialState = {
  users: {},
};

const getUserDetailsKey = username => `user-${username}`;
const actionTypes = {
  UPDATE_PROFILE: "UPDATE_PROFILE"
};
export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_ACCOUNT.START:
      return {
        ...state,
        users: {
          ...state.users,
          [getUserDetailsKey(action.meta.username)]: {
            ...state[getUserDetailsKey(action.meta.username)],
            fetching: true,
            loaded: false,
            failed: false,
          },
        },
      };
    case actions.GET_ACCOUNT.SUCCESS:
      //console.log("GET_ACCOUNT.SUCCESS action.payload: ",action.payload)
      return {
        ...state,
        users: {
          ...state.users,
          [getUserDetailsKey(action.meta.username)]: {
            ...state[getUserDetailsKey(action.meta.username)],
            ...action.payload,
            fetching: false,
            loaded: true,
            failed: false,
          },
        },
      };
    case actions.GET_ACCOUNT.ERROR:
      return {
        ...state,
        users: {
          ...state.users,
          [getUserDetailsKey(action.meta.username)]: {
            ...state[getUserDetailsKey(action.meta.username)],
            fetching: false,
            loaded: false,
            failed: true,
          },
        },
      };
    // case actionTypes.UPDATE_PROFILE:
    //   console.log("actionTypes.UPDATE_PROFILE: ",getUserDetailsKey(action.payload.user.name));
    //   return {
    //     ...state,
    //     users: {
    //       ...state.users,
    //       [getUserDetailsKey(action.payload.user.name)]: {
    //         ...state[getUserDetailsKey(action.payload.user.name)],
    //         ...action.payload.user,
    //         fetching: false,
    //         loaded: true,
    //         failed: false,
    //       },
    //     },
    //   };
    default: {
      return state;
    }
  }
}

export const getUser = (state, username) => {
  const user = _.get(state.users, getUserDetailsKey(username), {});
  // console.log("1 USERS REDUCER search for: ",username);
  // console.log("2 USERS REDUCER getUser: ",user);
  // console.log("-----------------------------------------------------");
  return user;
};
export const getIsUserFetching = (state, username) => getUser(state, username).fetching || false;
export const getIsUserLoaded = (state, username) => getUser(state, username).loaded || false;
export const getIsUserFailed = (state, username) => getUser(state, username).failed || false;
