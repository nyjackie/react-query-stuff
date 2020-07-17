import {
  BANNED_REQUEST,
  BANNED_SUCCESS,
  BANNED_FAIL,
  CLEAR_STATE
} from '../actions/types';

const initialState = {
  list: [],
};

export default function bannedReducer (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case BANNED_SUCCESS:
      return {
        ...state,
        list: payload,
      };
    case CLEAR_STATE:
    case BANNED_FAIL:
      return {
        ...state,
        list: [],
      };
    case BANNED_REQUEST:
    default:
      return state;
  }
}
