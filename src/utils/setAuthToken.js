import { api } from 'gdd-components';
import tokenStore from 'gdd-components/dist/api/tokenStore';
import errorHandler from 'utils/errorHandler';

const setAuthToken = token => {
  if (token) {
    api.setAuthHeader(token);
    tokenStore.update({ accessToken: token }).catch(err => {
      errorHandler('error storing new access token from refresh', err);
    });
  } else {
    api.removeAuthHeader();
    tokenStore.update({ accessToken: void 0 }).catch(err => {
      errorHandler('error storing new access token from refresh', err);
    });
  }
};

export default setAuthToken;
