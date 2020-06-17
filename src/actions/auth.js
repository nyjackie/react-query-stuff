import userService from 'services/user.service';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_REQUESTED,
} from './types';

export const register = ({ email, password, first_name, last_name }) => async dispatch => {
  // const body = { email, password, first_name, last_name };
  try {
    // let res = await api.createUser(body);
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
  dispatch({
    type: LOGIN_REQUESTED,
  });

  const [err, data] = await userService.login(email, password);
  if (data) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.token,
    });
    return;
  }

  if (err) {
    console.error(err); // TODO delete this line eventually
    const errors = err.response?.data?.errors;
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
  userService.logout();
  dispatch({ type: LOGOUT });
};

// Load Logged in User
export const loadUser = () => async dispatch => {
  try {
    const token = userService.loadUser();

    if (!token) {
      throw new Error(AUTH_ERROR);
    }

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
