import api from 'api';
import {
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
  SEARCH_FAIL,
  SAVE_REQUEST,
  SAVE_SUCCESS,
  SAVE_FAIL,
} from 'actions/types';
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

export const saveProfile = profileData => async dispatch => {
  dispatch({
    type: SAVE_REQUEST,
  });

  // TODO: this is only during mock testing to show the spinner
  await wait(1000);

  try {
    const response = await api.saveProfile(profileData);
    if (response.status === 200) {
      dispatch({
        type: SAVE_SUCCESS,
        payload: profileData,
      });
      return;
    }
    // do something if response is not 200?
  } catch (err) {
    dispatch({
      type: SAVE_FAIL,
    });
    throw err;
  }
};
