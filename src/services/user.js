import setAuthToken from 'utils/setAuthToken';
import api from 'api';

export async function login(email, password) {
  try {
    const res = await api.login(email, password);
    setAuthToken(res.data.token);
    return [null, res.data];
  } catch (err) {
    return [err, null];
  }
}

export function logout() {
  setAuthToken(null);
}

export function loadUser() {
  const token = localStorage.getItem('token');
  setAuthToken(token);
  return token;
}

export default {
  login,
  logout,
  loadUser,
};
