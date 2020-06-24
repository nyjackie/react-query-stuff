import { combineReducers } from 'redux';
import auth from './auth';
import claims from './claims';
import ui from './ui';
import loading from './loading';
import search from './search';
import notification from './notifications';

export default combineReducers({
  notification,
  auth,
  ui,
  loading,
  claims,
  search,
});
