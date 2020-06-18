import { combineReducers } from 'redux';
import auth from './auth';
import claims from './claims';
import ui from './ui';
import loading from './loading';

export default combineReducers({
  auth,
  ui,
  loading,
  claims,
});
