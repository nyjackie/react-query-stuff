import { queryCache } from 'react-query';
import { useState, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import tokenStore from 'gdd-api-lib/dist/tokenStore';

tokenStore.openDB('gdd-admin-db');

/**
 * @typedef {object} TokensData
 * @property {string} jwt
 * @property {string} refresh_token
 *
 * @callback LoginParams
 * @param {string} email
 * @param {string} password
 * @returns {Promise<TokensData>}
 *
 * @callback TokenRetry
 * @param {number} failCount
 * @param {Error?} error
 * @returns {boolean}
 */

/**
 * a react-query hook to automatically refresh tokens
 * source:
 * https://github.com/killerchip/token-query
 * https://github.com/killerchip/token-query/blob/master/src/token-query/tokenQuery.ts
 * @param {object} config
 * @param {string?} [config.queryKey='token'] react-query key, defauls to "token"
 * @param {function(TokensData):boolean} config.tokenExpired function that checks wether current jwt has expired or not
 * @param {LoginParams} config.sendLogin function that handles logging in
 * @param {function(TokensData):void} config.sendLogout send logout to api
 * @param {function(TokensData):Promise<TokensData>} config.sendRefresh function that handles sending refresh
 * @param {function():void} config.onRemoveToken function called when token is removed
 * @param {TokenRetry} config.retry function
 * @param {function(TokensData):boolean} config.shouldRefreshOnBackground
 */
function createTokenQuery({
  queryKey = 'token',
  tokenExpired,
  sendLogin,
  sendLogout,
  sendRefresh,
  onRemoveToken,
  retry,
  shouldRefreshOnBackground,
}) {
  let tokenRefreshIntervalHandler;
  let tokenRefreshInterval;

  /**
   * @returns {Promise<TokensData>}
   */
  async function getTokenFromStorage() {
    return await tokenStore.get();
  }

  /**
   * get/set the token value in indexedDB and queryCache
   * @param {object} TokensData { jwt, refresh_token }
   */
  async function setTokenValue(tokenData) {
    if (!tokenData) {
      await tokenStore.remove();
      onRemoveToken();
    } else {
      await tokenStore.set(tokenData);
    }

    queryCache.setQueryData(queryKey, tokenData);
  }

  /**
   * perform a token refresh
   * @param {boolean} throwOnError
   */
  async function refresh(throwOnError = false) {
    const token = queryCache.getQueryData(queryKey);
    const queryFn = () => {
      return sendRefresh(token);
    };

    const tempKey = `temp-refresh-${queryKey}`;

    const newToken = await queryCache.prefetchQuery(
      tempKey,
      queryFn,
      {
        retry,
      },
      {
        throwOnError,
      }
    );

    // If token is undefined then refresh has failed
    if (newToken) {
      setTokenValue(newToken);
    }

    queryCache.removeQueries(tempKey);

    return newToken;
  }

  function startBackgroundRefreshing() {
    clearInterval(tokenRefreshIntervalHandler);

    tokenRefreshIntervalHandler = setInterval(() => {
      refresh();
    }, tokenRefreshInterval);
  }

  function stopBackgroundRefreshing() {
    clearInterval(tokenRefreshIntervalHandler);
  }

  async function login(loginParams) {
    const queryFn = () => {
      return sendLogin(loginParams);
    };

    const tempLoginKey = `temp-login-${queryKey}`;

    const token = await queryCache.prefetchQuery(
      tempLoginKey,
      queryFn,
      {
        retry,
      },
      {
        throwOnError: true,
      }
    );

    if (tokenRefreshInterval) {
      startBackgroundRefreshing();
    }

    queryCache.removeQueries(tempLoginKey);

    return token;
  }

  async function logout() {
    setTokenValue(null);
    stopBackgroundRefreshing();
    const token = queryCache.getQueryData(queryKey);
    sendLogout(token?.refresh_token);
  }

  function useLogin() {
    const [data, setData] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);

    const requestLogin = async (loginParams, throwOnError = false) => {
      setIsFetching(true);
      setData(null);
      setError(null);

      try {
        const token = await login(loginParams);

        setIsFetching(false);
        setData(token);
        setTokenValue(token);

        return token;
      } catch (loginError) {
        setIsFetching(false);
        setError(loginError);

        if (throwOnError) {
          throw loginError;
        }
      }

      return;
    };

    return { data, isFetching, error, requestLogin };
  }

  function useToken() {
    const existingToken = queryCache.getQueryData(queryKey);
    const [token, setToken] = useState(existingToken);

    useEffect(() => {
      const unsubscribe = queryCache.subscribe(newQueryCache => {
        const newToken = newQueryCache.getQueryData([queryKey]);

        if (!isEqual(token, newToken)) {
          setToken(newToken);
        }
      });

      return () => {
        unsubscribe();
      };
    });

    return { token, isAuthenticated: !!token };
  }

  /**
   * @param {boolean} force
   * @returns {TokensData}
   */
  async function getToken(force = false) {
    const token = queryCache.getQueryData(queryKey);

    if (!token) return;

    if (tokenExpired(token) || force) {
      const newToken = await refresh(true);

      return newToken;
    }

    if (shouldRefreshOnBackground && shouldRefreshOnBackground(token)) {
      await refresh();
    }

    return token;
  }

  async function init(refreshInterval) {
    if (refreshInterval) {
      tokenRefreshInterval = refreshInterval;
    }

    const tokens = await getTokenFromStorage();

    if (!tokens) {
      queryCache.setQueryData(queryKey, undefined);

      return;
    }

    queryCache.setQueryData(queryKey, tokens);

    if (refreshInterval) {
      startBackgroundRefreshing();
    }
  }

  return { init, useLogin, useToken, logout, refresh, getToken };
}

export default createTokenQuery;
