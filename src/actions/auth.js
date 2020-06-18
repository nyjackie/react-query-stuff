import userService from 'services/user';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, AUTH_ERROR, USER_LOADED } from './types';
import { wait } from 'utils';

export const login = (email, password) => async dispatch => {
  dispatch({
    type: LOGIN_REQUEST,
  });

  // TODO: this is only during mock testing to show the spinner
  await wait(1000);

  const [err, data] = await userService.login(email, password);

  if (data) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.token,
    });
    return;
  }

  if (err) {
    // debugger;
    const errors = err.response?.data?.errors;
    if (errors) {
      console.error(errors);
    }
    dispatch({
      type: LOGIN_FAIL,
    });
    if (err.response?.status === 401) {
      throw new Error('Invalid Credentials, try again');
    }
    throw new Error('A server error occured, try again');
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
