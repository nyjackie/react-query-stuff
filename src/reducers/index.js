import { combineReducers } from 'redux';
import auth from './auth';
import ui from './ui';
import notifications from './notifications';
import error from './error';

export default combineReducers({
  notifications,
  auth,
  ui,
  error,
});
