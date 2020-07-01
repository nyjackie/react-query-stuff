import { SEARCH_NONPROFIT_SUCCESS, SEARCH_NONPROFIT_FAIL, SAVE_NONPROFIT_SUCCESS } from 'actions/types';

const initialState = {
  results: [],
  selected: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SEARCH_NONPROFIT_SUCCESS:
      return {
        ...state,
        results: payload,
      };

    case SEARCH_NONPROFIT_FAIL:
      return {
        ...state,
        results: [],
      };
      
    case SAVE_NONPROFIT_SUCCESS:
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
