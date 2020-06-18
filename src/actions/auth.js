import userService from 'services/user.service';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, AUTH_ERROR, USER_LOADED } from './types';

export const login = (email, password) => async dispatch => {
  dispatch({
    type: LOGIN_REQUEST,
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
