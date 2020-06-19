import api from 'api';
import { SEARCH_REQUEST, SEARCH_SUCCESS, SEARCH_FAIL, SEARCH_SELECT } from 'actions/types';
import { wait } from 'utils'; // TODO delete after testing

/**
 * Generic search by EIN or NP Name or by key words
 * @param {string} searchTerm
 */
export const search = searchTerm => async dispatch => {
  dispatch({
    type: SEARCH_REQUEST,
  });

  // TODO: this is only during mock testing to show the spinner
  await wait(1000);

  try {
    const { data } = await api.search(searchTerm);
    if (data) {
      dispatch({
        type: SEARCH_SUCCESS,
        payload: data.data.hits,
      });
      return;
    }
  } catch (err) {
    dispatch({
      type: SEARCH_FAIL,
    });
    throw err;
  }
};

export const searchSelect = ein => dispatch => {
  dispatch({
    type: SEARCH_SELECT,
    payload: ein,
  });
};
