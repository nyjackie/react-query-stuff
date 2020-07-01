import api from 'api';
import { BANNED_REQUEST, BANNED_SUCCESS, BANNED_FAIL } from './types';

export const getBanned = () => async dispatch => {
  dispatch({
    type: BANNED_REQUEST,
  });

  try {
    const response = await api.getBanned();
    console.log('getBanned response', response)
    if (response.status === 200 && response.data) {
      dispatch({
        type: BANNED_SUCCESS,
        payload: response.data.data,
      });
      return;
    }
    throw new Error(`${response.status} - something went wrong`)
  } catch (err) {
    console.log('getBanned error', err)
    dispatch({
      type: BANNED_FAIL,
    });
    throw err;
  }
};
