import isObj from 'lodash/isPlainObject';
import {
  LOGIN_SUCCESS,
  LOGOUT,
  AUTH_ERROR,
  LOGIN_FAIL,
  AUTO_LOGIN_SUCCESS,
  AUTO_LOGIN_FAILED,
} from 'actions/types';

const initialState = {
  token: null,
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case AUTO_LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: isObj(payload.user),
        user: payload.user,
        token: payload.jwt,
        isLoading: false,
      };
    case AUTO_LOGIN_FAILED:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        isLoading: false,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: payload.jwt,
        isAuthenticated: true,
        user: payload.user,
      };
    case LOGIN_FAIL:
    case AUTH_ERROR: //will do same as logout??? or maybe include payload with message?
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
}
