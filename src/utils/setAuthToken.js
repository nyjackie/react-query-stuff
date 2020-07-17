import api from '../api';

const setAuthToken = token => {
  if (token) {
    api.setAuthHeader(token);
    localStorage.setItem('token', token);
  } else {
    api.removeAuthHeader();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken')
  }
};

export default setAuthToken;
