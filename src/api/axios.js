import axios from 'axios';
import mock from './mock';
import store from '../store';
import { LOGOUT, CLEAR_STATE } from '../actions/types';
import errorHandler from 'utils/errorHandler';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

/**
 * always use JSON for all API calls
 */
instance.defaults.headers.common['Content-Type'] = 'application/json';

/**
 * logout the user if the there is an auth error
 */
instance.interceptors.response.use(
  res => res,
  err => {
    errorHandler('intercept', err);
    const isAuthenticated = store.getState().auth.isAuthenticated;
    if (!isAuthenticated) return Promise.reject(err);

    if (!err.response) {
      // network error, should we logout?
      store.dispatch({ type: LOGOUT });
    }

    if (err.response && err.response.status === 401) {
      // Change it to data.msg instead of status code?
      store.dispatch({ type: LOGOUT });
      store.dispatch({ type: CLEAR_STATE });
    }
    return Promise.reject(err);
  }
);

// TODO: remove this once we have backend working
mock(instance);

export function setAuthHeader(token) {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

export function removeAuthHeader() {
  delete instance.defaults.headers.common['Authorization'];
}

export default instance;
