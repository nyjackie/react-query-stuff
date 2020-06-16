import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// always use JSON for all API calls
instance.defaults.headers.common['Content-Type'] = 'application/json';

const api = {
  // Accounts
  spending: () => instance.get('/accounts/spending/'),
  transactions: () => instance.get('/accounts/spending/transactions'),

  // Users
  users: (body, config = {}) => instance.post('/users', body, config),
  login: (config = {}) => instance.post('/users/login', {}, config),
};

export default api;
