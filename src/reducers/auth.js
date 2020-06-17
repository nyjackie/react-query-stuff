import jwt_decode from 'jwt-decode';
import {
  REGISTER_SUCCESS,
  LOGIN_SUCCESS,
  LOGOUT,
  AUTH_ERROR,
  LOGIN_FAIL,
  USER_LOADED,
  LOGIN_REQUESTED,
} from 'actions/types';

const initialState = {
  token: null,
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  let user = payload ? jwt_decode(payload) : null;

  switch (type) {
    case LOGIN_REQUESTED:
      return {
        ...state,
        isAuthenticated: false,
        loading: true,
        user: null,
      };
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
