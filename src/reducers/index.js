import { combineReducers } from 'redux';
import auth from './auth';
import claims from './claims';
import ui from './ui';
import loading from './loading';
import notification from './notifications';
import nonprofits from './nonprofits';

export default combineReducers({
  notification,
  auth,
  ui,
  loading,
  claims,
  nonprofits,
});
