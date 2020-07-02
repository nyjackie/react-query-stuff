import api from 'api';
import {
    SEARCH_REQUEST,
    SEARCH_USERS_SUCCESS,
    SEARCH_USER_SUCCESS,
    SEARCH_USERS_FAIL,
    SEARCH_USER_FAIL,
  } from 'actions/types';
  import { wait } from 'utils'; // TODO delete after testing

  export const getUsers = searchTerm => async dispatch => {
    dispatch({
      type: SEARCH_REQUEST,
    });
  
    // TODO: this is only during mock testing to show the spinner
    await wait(1000);
  
    try {
      const { data } = await api.getUsers(searchTerm);
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


  export const getUser = id => async dispatch => {
    dispatch({
      type: SEARCH_REQUEST,
    });
    await wait(1000);

    try {
      const response = await api.getUser(id);
      if (response) {
        dispatch({
          type: SEARCH_USER_SUCCESS,
          payload: response.data.data,
        });
        return;
      }
      throw new Error(`${response.status} - something went wrong`)
    } catch (err) {
      dispatch({
        type: SEARCH_USER_FAIL,
        // payload: { msg: err.response.msg, status: err.response.status },
      });
    }
  };