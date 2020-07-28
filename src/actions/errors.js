import { ERROR_SEEN } from 'actions/types';

export const setSeen = val => dispatch => {
  dispatch({ type: ERROR_SEEN, payload: val });
};
