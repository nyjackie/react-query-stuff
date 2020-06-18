import { SEARCH_SUCCESS, SEARCH_FAIL, SEARCH_SELECT } from 'actions/types';

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
    case SEARCH_SELECT:
      return {
        ...state,
        selected: state.results.find(item => item.ein === payload),
      };
    default:
      return state;
  }
}
