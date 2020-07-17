import {
  SEARCH_USERS_SUCCESS,
  SEARCH_USERS_FAIL,
  SAVE_USER_SUCCESS,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_FAIL,
  CLEAR_STATE,
} from 'actions/types';

const initialState = {
  results: [],
  selected: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SEARCH_USERS_SUCCESS:
      return {
        ...state,
        results: payload,
      };
    case SEARCH_USER_SUCCESS:
      return {
        ...state,
        selected: payload,
      };

    case SEARCH_USERS_FAIL:
      return {
        ...state,
        results: [],
      };
    case SEARCH_USER_FAIL:
      return {
        ...state,
        selected: null,
      };

    case SAVE_USER_SUCCESS:
      return {
        ...state,
        results: state.results.map(result => {
          if (result.ein === payload.ein) {
            return payload;
          }
          return result;
        }),
      };

    case CLEAR_STATE:
      return {
        results: [],
        selected: null,
        ...state,
      };

    default:
      return state;
  }
}
