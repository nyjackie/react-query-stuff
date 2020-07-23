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

    const authData = {
      user,
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    };

    await tokenStore.set(authData);

    return [null, authData];
  } catch (err) {
    return [err, null];
  }
}

/**
 * "logout" user by deleting all tokens from localStorage and api header
 */
export async function logout() {
  const tokensData = await tokenStore.get();
  api.auth.logout(tokensData?.refreshToken);
  tokenStore.remove();
  api.removeAuthHeader();
}

export async function resetPassword(email) {
  try {
    const res = await api.account.resetPassword(email);
    return [null, res.data];
  } catch (err) {
    return [err, null];
  }
}

export async function loadUser() {
  try {
    const tokensData = await tokenStore.get();
    if (tokensData) {
      api.setAuthHeader(tokensData.accessToken);
      return tokensData;
    }
    return false;
  } catch (err) {
    errorHandler(err);
    return false;
  }
}

export default {
  login,
  logout,
  loadUser,
  resetPassword,
};
