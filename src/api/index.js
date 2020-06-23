import axios from 'axios';
import store from '../store';
import { LOGOUT } from '../actions/types';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// always use JSON for all API calls
instance.defaults.headers.common['Content-Type'] = 'application/json';

if (process.env.NODE_ENV === 'development') {
  // dont want this accidentally ending up on production
  import('api/mock').then(mock => mock.default(instance));
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
  login,
  getClaims,
  getClaim,
  search,
  saveProfile,
};
