import api from 'api';
import setAuthToken from 'utils/setAuthToken';

async function login(email, password) {
  try {
    const res = await api.login(email, password);
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
