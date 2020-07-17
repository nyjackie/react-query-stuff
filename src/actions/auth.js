import userService from 'services/user';
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './types';
import { wait } from 'utils';
import setAuthToken from 'utils/setAuthToken';

export const login = (email, password) => async dispatch => {
  dispatch({
    type: LOGIN_REQUEST,
  });

  // TODO: this is only during mock testing to show the spinner
  await wait(1000);

  const [err, data] = await userService.login(email, password);

  if (data) {
    setAuthToken(data.token);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.token,
    });
    return;
  }

  if (err) {
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
