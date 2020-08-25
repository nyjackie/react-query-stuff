import jwt_decode from 'jwt-decode';
import { api } from 'gdd-components';
import errorHandler from 'utils/errorHandler';
import tokenStore from 'gdd-components/dist/api/tokenStore';

/**
 * replace the IndexedDB auth object with new data. If for some reason the accessToken
 * is bad and does not decode properly then it will only store the refreshToken
 * @param {string} accessToken
 * @param {string} refreshToken
 */
async function updateLocalStore(accessToken, refreshToken) {
  const authData = {
    refreshToken,
  };

  let user;
  try {
    user = jwt_decode(accessToken);
  } catch (e) {
    // failed to decode, accessToken is bad
  }

  if (user && user.expires) {
    // access token is good so we can store user and token
    authData.user = user;
    authData.accessToken = accessToken;
  }

  await tokenStore.set(authData);

  return authData;
}

/**
 * Sends login info to api
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  try {
    const res = await api.auth.login('internal', email, password);

    api.setAuthHeader(res.data.accessToken);

    const authData = await updateLocalStore(res.data.accessToken, res.data.refreshToken);

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
    let { user, accessToken, refreshToken } = tokensData || {};

    if (!refreshToken) {
      // if user has no refresh token for some reason we should just assume they are logged out
      // because it's not worth letting them do anything for the rest of the 5min left in their
      // access token because we cant refresh it
      return false;
    }

    if (accessToken && !user?.expires) {
      // if user does not exist but we have an access tokenn we can extract it
      user = jwt_decode(accessToken);
    }

    if (!user) {
      // if we can't decode the token and get user data then log them out
      return false;
    }

    const newAccessToken = await api.handleRefresh(user.expires, refreshToken);
    if (newAccessToken) {
      // new token success, store it and continue
      await updateLocalStore(newAccessToken, refreshToken);
      api.setAuthHeader(newAccessToken);
      tokensData.accessToken = newAccessToken;
      return tokensData;
    }

    // local accessToken is still good
    api.setAuthHeader(accessToken);
    return tokensData;
  } catch (err) {
    errorHandler('Error occured on initial page load user', err);
    return false;
  }
}

export default {
  login,
  logout,
  loadUser,
  resetPassword,
};
