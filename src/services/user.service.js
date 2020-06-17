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

export default {
  login,
  logout,
};
