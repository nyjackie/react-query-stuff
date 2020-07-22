import jwt_decode from 'jwt-decode';
import { LOGIN_SUCCESS, LOGOUT, AUTH_ERROR, LOGIN_FAIL, USER_LOADED } from 'actions/types';

const initialState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        user: payload ? jwt_decode(payload) : null,
        token: payload,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: payload,
        isAuthenticated: true,
        user: payload ? jwt_decode(payload) : null,
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
