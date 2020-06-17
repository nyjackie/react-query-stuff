import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from 'reducers';

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,

  /// This part is for redux dev tool...
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
