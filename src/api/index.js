import axios from 'axios';
import mockApi from 'api/mock';
import store from '../store';
import { LOGOUT } from '../actions/types';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// always use JSON for all API calls
instance.defaults.headers.common['Content-Type'] = 'application/json';

let mock;
if (process.env.NODE_ENV === 'development') {
  // dont want this accidentally ended up on production
  mock = mockApi(instance);
}

const api = {
  // Accounts
  spending: () => instance.get('/accounts/spending/'),
  transactions: () => instance.get('/accounts/spending/transactions'),

  // Users
  users: (body, config = {}) => instance.post('/users', body, config),
  login: (config = {}) => instance.post('/users/login', {}, config),
  load: (config = {}) => instance.get('users/', config),
};

//  ***logout the user if the there is an auth error***
api.interceptors.response.use(
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

export default api;
