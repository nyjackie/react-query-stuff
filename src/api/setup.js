import api from 'gdd-api-lib';
import tokenStore from 'gdd-api-lib/dist/tokenStore';
import mock from 'gdd-api-lib/dist/mocks/index';
import { PRIVATE_ROUTES } from 'gdd-api-lib/dist/routes';

// local modules
import store from '../store';
import { LOGOUT, CLEAR_STATE, LOGIN_SUCCESS, ERROR } from '../actions/types';
import errorHandler from 'utils/errorHandler';
import userService from 'services/user';

// required setting a IndexedDB database name
tokenStore.openDB('gdd-admin-db');

// TODO: remove this mock once API is completed
api.provideMock(mock, [PRIVATE_ROUTES.GET_NONPROFIT]);

/**
 * Set up the response inteceptor which will automatically handle logging out
 * if any api response returns a 401
 */
api.setupResponseInterceptor(
  function isAuthenticated() {
    return store.getState().auth.isAuthenticated;
  },
  function unauthorized(err) {
    errorHandler('Response Interceptor: Unauthorized', err);
    // definitely logout and clear state if unauthorized
    store.dispatch({ type: LOGOUT });
    store.dispatch({ type: CLEAR_STATE });
  },
  function onError(err) {
    errorHandler(err);
    // this redicts to an error page
    // store.dispatch({
    //   type: ERROR,
    //   payload: {
    //     error: err,
    //     errorType: 'API',
    //   },
    // });
  }
);

api.setupRequestInterceptor(
  function getTokens() {
    // this function should return a promise resolving with the complete object
    // in indexeddb
    return tokenStore.get();
  },
  async function onNewTokens(tokens) {
    let authData = tokens;

    try {
      authData = await userService.updateLocalStore(tokens.jwt, tokens.refresh_token);
    } catch (err) {
      errorHandler('Error storing new access token from refresh', err);
    }

    // we should maybe update user in memory too
    // TODO: should this be LOGIN_SUCCESS? maybe a NEW_ACCESS_TOKEN or something
    store.dispatch({
      type: LOGIN_SUCCESS,
      payload: authData,
    });
  },
  function onError(err) {
    // refresh token failed to get a new access token OR there was a problem
    // decoding the current access token
    errorHandler('Request Interceptor:', err);
  }
);
