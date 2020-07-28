import { ERROR_SEEN, ERROR, CLEAR_STATE } from 'actions/types';

const initialState = {
  error: null,
  errorType: null,
  seen: false,
};

export default function errorReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ERROR_SEEN:
      return {
        ...state,
        seen: payload,
      };
    case ERROR:
      return {
        ...state,
        error: payload.error || null,
        errorType: payload.errorType || null,
        seen: false,
      };
    case CLEAR_STATE:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
}
