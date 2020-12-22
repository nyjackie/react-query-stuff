// import { api } from 'gdd-components';
import { setAuthHeader, removeAuthHeader } from 'gdd-api-lib/dist/setup';
import tokenStore from 'gdd-api-lib/dist/tokenStore';
import errorHandler from 'utils/errorHandler';

const setAuthToken = token => {
  if (token) {
    setAuthHeader(token);
    tokenStore.update({ jwt: token }).catch(err => {
      errorHandler('error storing new access token from refresh', err);
    });
  } else {
    removeAuthHeader();
    tokenStore.update({ jwt: void 0 }).catch(err => {
      errorHandler('error storing new access token from refresh', err);
    });
  }
};

export default setAuthToken;
