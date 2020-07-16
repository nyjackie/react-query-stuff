import jwt_decode from 'jwt-decode';
import API from 'api';
import errorHandler from '../utils/errorHandler'

/**
 * Sends login info to api
 * @param {string} email 
 * @param {string} password 
 */
export async function login(email, password) {
  try {
    const res = await API.login(email, password);
    API.setAuthHeader(res.data.token);
    localStorage.setItem('token', res.data.token);
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
  try {
    const token = localStorage.getItem('token');
    if (token) {
      API.setAuthHeader(token);
      const user = jwt_decode(token);
      return { token, user };
    }
  } catch (err) {
    errorHandler(err);
  }
  return { token: null, user: null };
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
