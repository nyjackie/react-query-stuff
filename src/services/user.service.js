import api from 'api';
import setAuthToken from 'utils/setAuthToken';

import { wait } from 'utils';

async function login(email, password) {
  try {
    const res = await api.login(email, password);

    await wait(2000);

    setAuthToken(res.data.token);
    return [null, res.data];
  } catch (err) {
    return [err, null];
  }
}

function logout() {
  setAuthToken(null);
}

function loadUser() {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  return token;
}

export default {
  login,
  logout,
  loadUser,
};
