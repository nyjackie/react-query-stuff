import { SET_NOTIFICATION, REMOVE_NOTIFICATION } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 *
 * @param {string} msg the text for the notificatio
 * @param {'success'|'error'|'warning'|'info'} type sets the color of the notification
 * @param {number} waitTime how long in milliseconds the notification stays on screen
 */
export const setNotification = (msg, type = 'none', waitTime = 10000) => dispatch => {
  const id = uuidv4();

  dispatch({
    type: SET_NOTIFICATION,
    payload: { msg, id: id, waitTime, type },
  });
  setTimeout(() => dispatch({ type: REMOVE_NOTIFICATION, payload: id }), waitTime);
};

export const removeNotification = id => dispatch => {
  dispatch({
    type: REMOVE_NOTIFICATION,
    payload: id,
  });
};
