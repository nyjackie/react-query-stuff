import createTokenQuery from './tokenQuery';
import api from 'gdd-api-lib';
import jwt_decode from 'jwt-decode';

function getTokenExpiry(jwt) {
  try {
    return jwt_decode(jwt).exp;
  } catch (e) {
    // failed to decode, jwt is bad
    return undefined;
  }
}

function getNow() {
  // our tokens expiry use Unix Epoch UTC Timestamps in seconds
  return Math.floor(new Date().getTime() / 1000);
}

/**
 * @param {object} param0  `{ jwt, refresh_token }`
 */
const tokenExpired = ({ jwt }) => {
  const expiry = getTokenExpiry(jwt);
  if (!expiry) return true;
  return expiry <= getNow();
};

/**
 *
 * @param {object} credentials `{ email, password }`
 * @returns {Promise<object?>} `{ jwt, refresh_token }`
 */
async function sendLogin({ email, password }) {
  const headers = {
    Authorization: 'Basic ' + window.btoa(email + ':' + password),
  };
  try {
    const res = await api.internalUserLogin(headers);
    api.setAuthHeader(res.data.jwt);
    return res.data;
  } catch (err) {
    // log error?
    return undefined;
  }
}

async function sendLogout(refresh_token) {
  try {
    await api.logout({ refresh_token });
  } catch (err) {}
}

/**
 * @param {object} tokens `{ jwt, refresh_token }`
 * @returns {Promise<object?>} `{ jwt, refresh_token }`
 */
const sendRefresh = async ({ jwt, refresh_token }) => {
  try {
    const res = await api.refreshAuthToken({ expired_jwt: jwt, refresh_token });
    return res.data;
  } catch (error) {
    return undefined;
  }
};

const retry = (count, error) => count < 3 && !error.status !== 401;

const shouldRefreshOnBackground = ({ jwt }) => {
  // tokens expire every 5 minutes but we want to set the refresh interval at
  // every 4.5 minutes so we subtract 30s from the expiry
  const now = getNow();
  const expiry = getTokenExpiry(jwt);
  if (!expiry) return true;
  return now > expiry - 30;
};

const tokenQuery = createTokenQuery({
  queryKey: 'authTokens',
  tokenExpired,
  sendLogin,
  sendLogout,
  sendRefresh,
  onRemoveToken: () => {
    api.setAuthHeader(null);
  },
  retry,
  // shouldRefreshOnBackground,
});

export const useToken = tokenQuery.useToken;
export const useLogin = tokenQuery.useLogin;
export const logout = tokenQuery.logout;
export const refresh = tokenQuery.refresh;
export const getToken = tokenQuery.getToken;
export const init = tokenQuery.init;

export default tokenQuery;
