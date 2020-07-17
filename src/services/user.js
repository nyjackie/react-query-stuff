import API from 'api';

/**
 * Sends login info to api
 * @param {string} email 
 * @param {string} password 
 */
export async function login(email, password) {
  try {
    const res = await API.login(email, password);
    return [null, res.data];
  } catch (err) {
    return [err, null];
  }
}

/**
 * "logout" user by deleting all tokens from localStorage and api header
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken')
  API.removeAuthHeader();
}

/**
 * loads and decodes the auth token from localStorage
 * @returns {{token: string?, user: object?}}
 */
export function loadUser() {
  const token = localStorage.getItem('token');
  // API.setAuthHeader(token)
  return token;
  
}

export async function resetPassword(email) {
  try {
    const res = await API.resetPassword(email);
    return [null, res.data];
  } catch (err) {
    return [err, null];
  }
}

export default {
  login,
  logout,
  loadUser,
  resetPassword,
};
