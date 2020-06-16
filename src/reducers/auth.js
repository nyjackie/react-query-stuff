import jwt_decode from 'jwt-decode';
import { REGISTER_SUCCESS, LOGIN_SUCCESS, LOGOUT, AUTH_ERROR } from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
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
    case AUTH_ERROR: //will do same as logout??? or maybe include payload with message?
    case LOGOUT:
      console.log('inhere');
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
