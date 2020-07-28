import { combineReducers } from 'redux';
import auth from './auth';
import ui from './ui';
import notification from './notifications';
import error from './error';

export default combineReducers({
  notification,
  auth,
  ui,
  error,
});
