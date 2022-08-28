import { createAction } from 'redux-actions';
const dsteem = require('dsteem');

const TYPES = {
  SET_IS_AV_REG_ACCOUNT: "SET_IS_AV_REG_ACCOUNT",
  LOGIN_ERROR: '@es_auth/LOGIN_ERROR',
  SET_IS_AV_REG_PASS: "SET_IS_AV_REG_PASS",
  RGISTRATION_START: "RGISTRATION_START",
  RGISTRATION_SUCCESS: "RGISTRATION_SUCCESS",
  RGISTRATION_ERROR: "RGISTRATION_ERROR",
  RESET_REGISTRATION: "RESET_REGISTRATION"
};

const loginError = createAction(TYPES.LOGIN_ERROR);


export const isAvailableAccount = (accountName) => (dispatch, getState, { steemAPI, dsteemClient }) => {
  let getAccountPromise = steemAPI.sendAsync('condenser_api.get_accounts', [[accountName]])
    // steemAPI.sendAsync('condenser_api.get_accounts', [["kids-trail"]])//WORKING QUERY
    .then((resp) => {
      let isAv = false;

      if(resp.length===0) {
        console.log("[BANTER] There is no such ES account: ",resp);
        isAv = true;
      }
      else if(resp.length === 1) {
        console.log("[BANTER] Found account - response: ", resp)
      }

      return dispatch({
        type: TYPES.SET_IS_AV_REG_ACCOUNT,
        payload: {
          isAvailableAccount: isAv,
        }
      })//.catch(() => dispatch(loginError()));
    })
    .catch((err)=>{
      console.log("ERROR: ",err)
    });
}

export const isAvailablePassword = (accountName, pass) => (dispatch, getState, { steemAPI }) => {
  // console.log("isAvailablePassword Action");
  // console.log("accountName: ",accountName);
  // console.log("pass: ",pass);

  // const isValidPass = WalletDb.validatePassForRegistration(pass, accountName);
  //
  // isValidPass.then( (isValid)=>{
  //   return dispatch({
  //     type: TYPES.SET_IS_AV_REG_PASS,
  //     payload: {
  //       isAvailablePassword: isValid,
  //     }
  //   })//.catch(() => dispatch(loginError()));
  // }).catch((err)=>{
  //   console.log("err: ",err);
  // });



};

export const startRegistration = () => (dispatch) => {
  return dispatch({
    type: TYPES.RGISTRATION_START,
    payload: {}
  })
};

export const resetRegistration = () => (dispatch) => {
  return dispatch({
    type: TYPES.RESET_REGISTRATION,
    payload: {}
  })
};

export  const register = (accountName, password) => (dispatch, getState, { steemAPI,  }) => {
  console.log("Call Registration Action");
  const opts = {
    addressPrefix: 'BTS',
    chainId: '4ff15a093f2777fd61a9381fc62dfb3fd54e3770494afcfb392a51352715b4e9'
  };
  const dsteemClient = new dsteem.Client('https://node.banter.network',opts);

  const ownerKey = dsteem.PrivateKey.fromLogin(accountName, password, 'owner');
  const activeKey = dsteem.PrivateKey.fromLogin(accountName, password, 'active');
  const postingKey = dsteem.PrivateKey.fromLogin(accountName, password, 'posting');
  const memoKey = dsteem.PrivateKey.fromLogin(accountName, password, 'memo').createPublic(opts.addressPrefix);

  const ownerAuth = {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[ownerKey.createPublic(opts.addressPrefix), 1]],
  };
  const activeAuth = {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[activeKey.createPublic(opts.addressPrefix), 1]],
  };
  const postingAuth = {
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[postingKey.createPublic(opts.addressPrefix), 1]],
  };

  const creator = 'banter';
  const newName = accountName;;
  const json_meta = '';
  const owner = ownerAuth;
  const active = activeAuth;
  const posting = postingAuth;
  const memo = memoKey;
  const broadcast = true;
  const fee = '5.000 SOCIAL';

  const op = [
    'account_create',
    {
      creator,
      new_account_name: newName,
      json_metadata: json_meta,
      owner,
      active,
      posting,
      memo_key: memo,
      broadcast,
      fee,
    }
  ];

  const privateKey = dsteem.PrivateKey.from('5K5f47eZWTy3X7oeDdFNa3U4XFicq2NDFFu1ZRaG6YhFGqbGV9W');// active private key


  console.log("Account creation opts: ",op);

  dsteemClient.broadcast.sendOperations([op], privateKey)
    .then(
      data => {
        dsteemClient.database.call('get_accounts', [[accountName]])
          .then((_account) => {
            if(_account.length===0) {
              console.log("[BANTER] There is no such account: ",_account);
            }
            else if(_account.length === 1) {
              console.log("[BANTER] Found account - response: ",_account)
              localStorage.setItem('registerdAccount', _account[0]);
              return Promise.all([
                dispatch({
                  type: TYPES.RGISTRATION_SUCCESS,
                  payload: {res: data, registeredAccount: _account[0]}
                }),
              ])

            }
          })
          .catch((err)=>{
            console.error("[BANTER] GET ACCOUNTS ERROR: ",err)
          });
      },
      error => {
        console.error( "[BANTER] CREATE ACCOUNT ERROR2: ",error  );
        return dispatch({
          type: TYPES.RGISTRATION_ERROR,
          payload: {}
        })
      })
    .catch(err => {
      console.error("[BANTER] CREATE ACCOUNT ERROR3: ", err);
      return dispatch({
        type: TYPES.RGISTRATION_ERROR,
        payload: {}
      });
    });

};

