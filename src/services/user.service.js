import api from 'api';
import setAuthToken from 'utils/setAuthToken';

async function login(email, password) {
  const config = {
    headers: {
      Authorization: 'Basic ' + window.btoa(email + ':' + password),
    },
  };

  try {
    const res = await api.login(config);
    if (res.status !== 200) {
      logout();
      window.location.reload(true);
      return;
    }
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
