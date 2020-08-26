import userService from 'services/user';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  AUTO_LOGIN_SUCCESS,
  AUTO_LOGIN_FAILED,
} from './types';
import errorHandler from 'utils/errorHandler';

export const login = (email, password) => async dispatch => {
  dispatch({
    type: LOGIN_REQUEST,
  });

  // authData will include the user object
  const [err, authData] = await userService.login(email, password);

  if (authData) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: authData,
    });
    return;
  }

  if (err) {
    errorHandler(err);
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

export const autoLogin = () => async dispatch => {
  const tokensData = await userService.loadUser();

  if (tokensData) {
    dispatch({
      type: AUTO_LOGIN_SUCCESS,
      payload: tokensData,
    });
    return;
  }

  dispatch({
    type: AUTO_LOGIN_FAILED,
  });
};
