import { createAction } from 'redux-actions';
// import {Apis} from "bitsharesjs-ws";
// import {ChainStore} from "bitsharesjs";
// import WalletDb from "./loginBts/stores/WalletDb";

// import { getAllFollowing } from '../helpers/apiHelpers';

const TYPES = {
  LOGIN_START: '@es_auth/LOGIN_START',
  LOGIN_SUCCESS: '@auth/LOGIN_SUCCESS',
  LOGIN_ERROR: '@auth/LOGIN_ERROR'
};

const GET_FOLLOWING = '@user/GET_FOLLOWING';
const loginError = createAction(TYPES.LOGIN_ERROR);


export const login = (accountName, password) => (dispatch, getState, { steemAPI }) => {
  // console.log("Call Login Action");
  const state = getState();

  let promise = Promise.resolve(null);

  // if (getIsLoaded(state)) {
  //   promise = Promise.resolve(null);
  // }

  let getAccountPromise = steemAPI.sendAsync('condenser_api.get_accounts', [[accountName]])
  // let getAccountPromise = steemAPI.sendAsync('condenser_api.get_accounts', [["vasko-1-test31"]])
  // steemAPI.sendAsync('condenser_api.get_accounts', [["kids-trail"]])//WORKING QUERY
    .then((resp) => {
      if(resp.length === 1) {
        console.log("Found ES account - response: ",resp)

        //TODO VALIDATE KEYS, EXTRACT FROM PASSWORD

        //CHECK IF BTS ACCOUNT EXISTS
        let counter = 1;
        let id = setInterval(()=>{
          if(counter===13){
            console.log("There is no BTS account[undefined].");
            clearInterval(id);
            return dispatch({
              type: TYPES.LOGIN_ERROR,
              payload: {}
            })//.catch(() => dispatch(loginError()));
          }
        })
        //console.log("Get bts account counter: ",counter);
        /*  let acc = ChainStore.getAccount(accountName);
         if(acc){
           //console.log("Found BTS Account: ",acc);
           //console.log("---------------------------------");
           clearInterval(id);

           let isLocked1 = WalletDb.isLocked();
           //console.log("is locked before login: ", isLocked1)
           //TODO TRY TO LOG IN
           WalletDb.validatePassword(
             password || "",
             true, //unlock
             accountName
           ).then(({success, cloudMode})=>{
             // console.log("MARKER success: ",success);
             // console.log("cloudMode: ",cloudMode);
             let isLocked = WalletDb.isLocked();
             // console.log("is locked after login: ", isLocked)
             if (isLocked) {
               // this.setState({passwordError: true});
               console.log("Login error.");
               return dispatch({
                 type: TYPES.LOGIN_ERROR,
                 payload: {}
               })//.catch(() => dispatch(loginError()));
             } else if(!isLocked){
               console.log("Account[" + accountName + "] is logged in.");

               dispatch({
                 type: GET_FOLLOWING,
                 meta: accountName,
                 payload: {
                   promise: getAllFollowing(accountName),
                 },
               });
               //user: action.payload.account || state.user,
               //userSCMetaData: action.payload.user_metadata,
               return dispatch({
                 type: TYPES.LOGIN_SUCCESS,
                 payload: {
                   account: resp[0],
                   user_metadata:{}
                 }
               })//.catch(() => dispatch(loginError()));

             }
           });
         }
         //console.log("=================================");
         counter++;
       },100); */

      } else {
        console.log("There is no such account: ",resp)
      }
    })
    .catch((err)=>{
      console.log("ERROR: ",err)
    });

  //TODO CHECK KEYS HERE
  // if (!steemConnectAPI.options.accessToken) {
  //
  //
  //   promise = Promise.reject(new Error('There is not accessToken present'));
  // } else {
  //   promise = steemConnectAPI.me().catch(() => dispatch(loginError()));
  // }

  // return dispatch({
  //   type: TYPES.LOGIN_SUCCESS,
  //   payload: {
  //     getAccountPromise,
  //   }
  // }).catch(() => dispatch(loginError()));
};
