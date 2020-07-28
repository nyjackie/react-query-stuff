import { ERROR, CLEAR_STATE } from 'actions/types';

const initialState = {
  error: null,
  errorType: null,
};

export default function errorReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ERROR:
      return {
        ...state,
        error: payload.error,
        errorType: payload.errorType,
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
