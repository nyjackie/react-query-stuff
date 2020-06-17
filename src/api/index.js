import axios from 'axios';
import mockApi from 'api/mock';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// always use JSON for all API calls
instance.defaults.headers.common['Content-Type'] = 'application/json';

let mock;
if (process.env.NODE_ENV === 'development') {
  // dont want this accidentally ended up on production
  mock = mockApi(instance);
}

const api = {
  // Accounts
  spending: () => instance.get('/accounts/spending/'),
  transactions: () => instance.get('/accounts/spending/transactions'),

  // Users
  users: (body, config = {}) => instance.post('/users', body, config),
  login: (config = {}) => instance.post('/users/login', {}, config),
  load: (config = {}) => instance.get('users/', config),
};

export default api;
