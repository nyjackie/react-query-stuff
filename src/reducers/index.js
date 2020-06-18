import { combineReducers } from 'redux';
import auth from './auth';
import ui from './ui';
import loading from './loading';
import search from './search';

export default combineReducers({
  auth,
  ui,
  loading,
  search,
});
