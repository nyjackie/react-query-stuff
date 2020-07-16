import instance, { setAuthHeader, removeAuthHeader } from './instance';

/**************************************************
 * "Public" api endpoints that dont require auth
 */

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Returns a Promise resolving with an axios response object
 */
function login(email, password) {
  const config = {
    headers: {
      Authorization: 'Basic ' + window.btoa(email + ':' + password),
    },
  };
  return instance.post('/users/login', {}, config);
}

/**************************************************
 * "Private" auth required api endpoints
 */

function getClaims() {
  return instance.get('/claims');
}

function getClaim(id) {
  return instance.get(`/claims/${id}`);
}

function searchNonprofit(term) {
  return instance.post('/internal/nonprofit', { search_terms: term });
}

function getUsers(term) {
  return instance.post('/internal/users', { search_terms: term });
}

function getUser(id) {
  return instance.get(`/internal/users/${id}`);
}

function saveProfile(data) {
  return instance.post('/nonprofit/save', data);
}

function resetPassword(email) {
  return instance.post('/internal/password/reset', { email });
}

function getBanned() {
  return instance.get('/internal/banned');
}

function locationSearch(searchTerm) {
  return instance.get('/location/search/' + encodeURIComponent(searchTerm));
}

/***************************************************/

const api = {
  login,
  getClaims,
  getClaim,
  searchNonprofit,
  getUsers,
  getUser,
  saveProfile,
  resetPassword,
  getBanned,
  locationSearch,
  setAuthHeader,
  removeAuthHeader,
};

export default api;
