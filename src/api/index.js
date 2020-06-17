import axios from 'axios';
import mockApi from 'api/mock';
import store from '../store';
import { LOGOUT } from '../actions/types';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// always use JSON for all API calls
instance.defaults.headers.common['Content-Type'] = 'application/json';

if (process.env.NODE_ENV === 'development') {
  // dont want this accidentally ending up on production
  mockApi(instance);
}

// Accounts
function spending() {
  return instance.get('/accounts/spending/');
}
function transactions() {
  return instance.get('/accounts/spending/transactions');
}

/**
 *
 * @param {object} body
 */
function createUser(body) {
  return instance.post('/users', body);
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Returns a Promise resolving with an axios response object
 */
function login(email, password) {
  const config = {
    headers: {
      Authorization: 'Basic ' + window.btoa(email + ':' + password),
    },
  };
  return instance.post('/users/login', {}, config);
}

//  ***logout the user if the there is an auth error***
instance.interceptors.response.use(
  res => res,
  err => {
    if (err.response.status === 401) {
      ///Change it to data.msg instead of status code?

      store.dispatch({ type: LOGOUT });
      // store.dispatch({ type: CLEAR_STATES })  //This should clear ALL STATES data... but LOGOUT might be enough
    }
    return Promise.reject(err);
  }
);

export default {
  // users
  login,
  createUser,

  // accounts
  transactions,
  spending,
};
