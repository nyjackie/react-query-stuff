import userService from 'services/user.service';
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
    // let res = await api.users(body);
    const res = { data: {} };
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
  const [err, data] = userService.login(email, password);
  if (data) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.token,
    });
  }

  if (err) {
    console.error(err);
    const errors = err.response?.data?.errors;
    if (errors) {
      console.error(errors);
    }
    dispatch({
      type: LOGIN_FAIL,
    });
    return;
  }
};

// Logout / Clear Profile
export const logout = () => dispatch => {
  userService.logout();
  dispatch({ type: LOGOUT });
};

// Load User
export const loadUser = () => async dispatch => {
  try {
    const token = userService.loadUser();
    dispatch({
      type: USER_LOADED,
      payload: token,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
