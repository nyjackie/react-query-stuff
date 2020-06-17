import api from '../api';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  AUTH_ERROR,
  USER_LOADED,
} from './types';
import { wait, fakeJWT } from 'utils'; // TODO: for dev only, remove later

export const register = ({ email, password, first_name, last_name }) => async dispatch => {
  const body = JSON.stringify({ email, password, first_name, last_name });
  try {
    let res = await api.users(body);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      alert('LOGIN FAILED');
      console.error('login failed', errors);
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      Authorization: 'Basic ' + window.btoa(email + ':' + password),
    },
  };
  try {
    // const res = await api.login(config);

    // TEMP for testing ***********************
    await wait(1000); // wait 1s to simulate round trip
    const res = {
      data: fakeJWT(),
    };
    // TEMP for testing ***********************

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err?.response?.data?.errors;
    if (errors) {
      console.error(errors);
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / Clear Profile
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};

// Load User
export const loadUser = () => async dispatch => {
  try {
    const res = await api.get();

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
