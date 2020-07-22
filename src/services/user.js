import jwt_decode from 'jwt-decode';
import { api } from 'gdd-components';
import errorHandler from 'utils/errorHandler';
import tokenStore from 'gdd-components/dist/api/tokenStore';

/**
 * Sends login info to api
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  try {
    const res = await api.auth.login(email, password);

    api.setAuthHeader(res.data.accessToken);

    const user = jwt_decode(res.data.accessToken);

    await tokenStore.set({
      user,
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    });

    return [null, res.data];
  } catch (err) {
    return [err, null];
  }
}

/**
 * "logout" user by deleting all tokens from localStorage and api header
 */
export function logout() {
  api.auth.logout(localStorage.getItem('refresh_token'));
  tokenStore.remove();
  api.removeAuthHeader();
}

/**
 * loads user data from localStorage
 * @returns {string?}
 */
export function loadUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    errorHandler(err);
    return null;
  }
}

export async function resetPassword(email) {
  try {
    const res = await api.account.resetPassword(email);
    return [null, res.data];
  } catch (err) {
    return [err, null];
  }
}

export default {
  login,
  logout,
  loadUser,
  resetPassword,
};
