import { SEARCH_SUCCESS, SEARCH_FAIL, SAVE_SUCCESS } from 'actions/types';

const initialState = {
  results: [],
  selected: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SEARCH_SUCCESS:
      return {
        ...state,
        results: payload,
      };
    case SEARCH_FAIL:
      return {
        ...state,
        results: [],
      };
    case SAVE_SUCCESS:
      return {
        ...state,
        results: state.results.map(result => {
          if (result.ein === payload.ein) {
            return payload;
          }
          return result;
        }),
      };
    default:
      return state;
  }
}
