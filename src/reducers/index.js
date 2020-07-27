import { combineReducers } from 'redux';
import auth from './auth';
import ui from './ui';
import loading from './loading';
import notification from './notifications';
import nonprofits from './nonprofits';
import users from './users';
import banned from './banned';

export default combineReducers({
  notification,
  auth,
  ui,
  loading,
  nonprofits,
  users,
  banned,
});
