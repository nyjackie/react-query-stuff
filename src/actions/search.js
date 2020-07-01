import api from 'api';
import {
  SEARCH_REQUEST,
  SEARCH_NONPROFIT_SUCCESS,
  SEARCH_NONPROFIT_FAIL,
  SEARCH_USERS_SUCCESS,
  SEARCH_USERS_FAIL,
  SAVE_NONPROFIT_REQUEST,
  SAVE_NONPROFIT_SUCCESS,
  SAVE_NONPROFIT_FAIL,
} from 'actions/types';
import { wait } from 'utils'; // TODO delete after testing

/**
 * Generic search by EIN or NP Name or by key words
 * @param {string} searchTerm
 */
export const searchNonprofit = searchTerm => async dispatch => {
  dispatch({
    type: SEARCH_REQUEST,
  });

  // TODO: this is only during mock testing to show the spinner
  await wait(1000);

  try {
    const { data } = await api.searchNonprofit(searchTerm);
    if (data) {
      dispatch({
        type: SEARCH_NONPROFIT_SUCCESS,
        payload: data.data.hits,
      });
      return;
    }
  } catch (err) {
    dispatch({
      type: SEARCH_NONPROFIT_FAIL,
    });
    throw err;
  }
};

export const searchUsers = searchTerm => async dispatch => {
  dispatch({
    type: SEARCH_REQUEST,
  });

  // TODO: this is only during mock testing to show the spinner
  await wait(1000);

  try {
    const { data } = await api.searchUsers(searchTerm);
    if (data) {
      dispatch({
        type: SEARCH_USERS_SUCCESS,
        payload: data.data.hits,
      });
      return;
    }
  } catch (err) {
    dispatch({
      type: SEARCH_USERS_FAIL,
    });
    throw err;
  }
};



export const saveProfile = profileData => async dispatch => {
  dispatch({
    type: SAVE_NONPROFIT_REQUEST,
  });

  // TODO: this is only during mock testing to show the spinner
  await wait(1000);

  try {
    const response = await api.saveProfile(profileData);
    if (response.status === 200) {
      dispatch({
        type: SAVE_NONPROFIT_SUCCESS,
        payload: profileData,
      });
      return;
    }
    // TODO: do something if response is not 200?
  } catch (err) {
    dispatch({
      type: SAVE_NONPROFIT_FAIL,
    });
    throw err;
  }
};
