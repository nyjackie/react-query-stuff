import { SET_NOTIFICATION, REMOVE_NOTIFICATION } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 *
 * @param {string} msg the text for the notificatio
 * @param {'success'|'fail'|'danger'|'warrning'} variant sets the color of the notification
 * @param {number} waitTime how long in milliseconds the notification stays on screen
 */
export const addNotification = (msg, variant = 'none', waitTime = 10000) => dispatch => {
  dispatch({
    type: SET_NOTIFICATION,
    payload: { msg, id: uuidv4(), waitTime, variant },
  });
};

export const removeNotification = id => dispatch => {
  dispatch({
    type: REMOVE_NOTIFICATION,
    payload: id,
  });
};
