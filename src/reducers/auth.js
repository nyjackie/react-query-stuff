import jwt_decode from 'jwt-decode';
import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT,
  AUTH_ERROR,
  LOGIN_FAIL,
  USER_LOADED,
} from '../actions/types';

let initialState = {
  token: null,
  isAuthenticated: null,
  loading: true,
  user: null,
};
const token = localStorage.getItem('token');
if (token) {
  const user = jwt_decode(token);
  initialState = {
    token: token,
    isAuthenticated: true,
    loading: false,
    user: user,
  };
}

export default function (state = initialState, action) {
  const { type, payload } = action;

  let user = payload ? jwt_decode(payload) : null;

  console.log('Reudcer: ', type);

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: payload,
        isAuthenticated: true,
        loading: false,
        user,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        token: payload,
        isAuthenticated: true,
        loading: false,
        user,
      };
    case LOGIN_FAIL:
    case AUTH_ERROR: //will do same as logout??? or maybe include payload with message?
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
