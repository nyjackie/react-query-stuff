import jwt_decode from 'jwt-decode';
import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT,
  AUTH_ERROR,
  LOGIN_FAIL,
  USER_LOADED,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case LOGIN_SUCCESS:
      console.log('Reudcer: LOGIN_SUCCESS');
      debugger;
      return {
        ...state,
        token: payload,
        isAuthenticated: true,
        loading: false,
        user: payload ? { token: jwt_decode(payload) } : null,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        token: payload,
        isAuthenticated: true,
        loading: false,
        user: payload ? { token: jwt_decode(payload) } : null,
      };
    case LOGIN_FAIL:
      console.log('Reudcer: LOGIN_FAIL');
    case AUTH_ERROR: //will do the same as logout??? or maybe include payload with message?
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
}
