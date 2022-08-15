import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import steemAPI from './steemAPI';
import constants from '../server/routes/common/constants';

const dsteem = require('dsteem');

let opts = {};
opts.addressPrefix = 'BTS';
opts.chainId = '9e42d42746f9f0ae04ce62e1c1bc4901db89c4b805386a23dd73ea202b1cae14';

//connect to server which is connected to the network/testnet
// const dsteemClient = new dsteem.Client('http://79.143.179.62:8282',opts);
const dsteemClient = new dsteem.Client(constants.BTRS.API_ADDRESS,opts);




// const dsteemClient = new dsteem.Client('http://79.143.179.62:8080');
// const steemClient = require('@steemit/steem-js');
// steemClient.api.setOptions({ url: "http://79.143.179.62:8080" });
// steemClient.api.setOptions({ url: "http://79.143.179.62:8282" });//via proxy

import createBusyAPI from '../common/services/createBusyAPI';
import history from './history';
import errorMiddleware from './helpers/errorMiddleware';
import createReducer from './reducers';

export default () => {
  let preloadedState;
  if (typeof window !== 'undefined') {
    /* eslint-disable no-underscore-dangle */
    preloadedState = window.__PRELOADED_STATE__;
    delete window.__PRELOADED_STATE__;
    /* eslint-enable no-underscore-dangle */
  }

  const middleware = [
    errorMiddleware,
    promiseMiddleware({
      promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR'],
    }),
    thunk.withExtraArgument({
      dsteemClient,
      steemAPI,
      //steemConnectAPI,
      //busyAPI: createBusyAPI(),
    }),
    routerMiddleware(history),
  ];

  let enhancer;
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-underscore-dangle
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(...middleware));
  } else {
    enhancer = compose(applyMiddleware(...middleware));
  }

  return createStore(createReducer(), preloadedState, enhancer);
};
