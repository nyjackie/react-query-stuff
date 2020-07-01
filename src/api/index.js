import axios from 'axios';
import store from '../store';
import { LOGOUT } from '../actions/types';
import mock from './mock';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// always use JSON for all API calls
instance.defaults.headers.common['Content-Type'] = 'application/json';

// TODO: remove this once we have backend working
mock(instance)


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

function getClaims() {
  return instance.get('/claims');
}

function getClaim(id) {
  return instance.get(`/claims/${id}`);
}

function search(term) {
  return instance.post('/internal/search', { search_terms: term });
}

function saveProfile(data) {
  return instance.post('/nonprofit/save', data);
}

function resetPassword(email) {
  return instance.post('/internal/password/reset', { email });
}

function getBanned() {
  return instance.get('/internal/banned');
}

//  ***logout the user if the there is an auth error***
instance.interceptors.response.use(
  res => res,
  err => {
    console.log('intercept', err)
    if (!err.response) {
      // network error
      store.dispatch({ type: LOGOUT });
    }

    if (err.response && err.response.status === 401) {
      ///Change it to data.msg instead of status code?

      store.dispatch({ type: LOGOUT });
      // store.dispatch({ type: CLEAR_STATES })  //This should clear ALL STATES data... but LOGOUT might be enough
    }
    return Promise.reject(err);
  }
);

export default {
  login,
  getClaims,
  getClaim,
  search,
  saveProfile,
  resetPassword,
  getBanned
};
