import jwt_decode from 'jwt-decode';
import api from 'gdd-api-lib';
import errorHandler from 'utils/errorHandler';
import tokenStore from 'gdd-api-lib/dist/tokenStore';
import { willExpire } from 'utils';

/**
 * replace the IndexedDB auth object with new data. If for some reason the jwt
 * is bad and does not decode properly then it will only store the refresh_token
 * @param {string} jwt
 * @param {string} refresh_token
 */
async function updateLocalStore(jwt, refresh_token) {
  const authData = {
    refresh_token,
  };

  let user;
  try {
    user = jwt_decode(jwt);
  } catch (e) {
    // failed to decode, jwt is bad
  }

  if (user) {
    // access token is good so we can store user and token
    authData.user = user;
    authData.jwt = jwt;
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
    const headers = {
      Authorization: 'Basic ' + window.btoa(email + ':' + password),
    };
    const res = await api.internalUserLogin(headers);

    api.setAuthHeader(res.data.jwt);

    const authData = await updateLocalStore(res.data.jwt, res.data.refresh_token);

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
  api.logout({ refresh_token: tokensData?.refresh_token });
  tokenStore.remove();
  api.removeAuthHeader();
}

export async function forgotPassword(email) {
  try {
    const res = await api.forgotPasswordInternal({ email: window.btoa(email) });
    return [null, res.data];
  } catch (err) {
    return [err, null];
  }
}

export async function loadUser() {
  try {
    const tokensData = await tokenStore.get();
    let { user, jwt, refresh_token } = tokensData || {};

    if (!refresh_token) {
      // if user has no refresh token for some reason we should just assume they are logged out
      // because it's not worth letting them do anything for the rest of the 5min left in their
      // access token because we cant refresh it
      return false;
    }

    if (jwt && !user?.exp) {
      // if user does not exist but we have an access token we can extract it
      user = jwt_decode(jwt);
      tokensData.user = user;
    }

    if (!user) {
      // if we can't decode the token and get user data then log them out
      return false;
    }

    // check if token has expired
    if (willExpire(user.exp, 30)) {
      const newTokens = await api.handleRefresh(user.exp, refresh_token, jwt);
      if (newTokens) {
        // new token success, store it and continue
        await updateLocalStore(newTokens.jwt, newTokens.refresh_token);
        api.setAuthHeader(newTokens.jwt);
        newTokens.user = jwt_decode(newTokens.jwt);
        return newTokens;
      }
    }

    // local jwt is still good
    api.setAuthHeader(jwt);
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
  forgotPassword: forgotPassword,
  updateLocalStore,
};
