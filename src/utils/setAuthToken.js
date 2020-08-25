import { api } from 'gdd-components';
import tokenStore from 'gdd-components/dist/api/tokenStore';
import errorHandler from 'utils/errorHandler';

const setAuthToken = token => {
  if (token) {
    api.setAuthHeader(token);
    tokenStore.update({ jwt: token }).catch(err => {
      errorHandler('error storing new access token from refresh', err);
    });
  } else {
    api.removeAuthHeader();
    tokenStore.update({ jwt: void 0 }).catch(err => {
      errorHandler('error storing new access token from refresh', err);
    });
  }
};

export default setAuthToken;
