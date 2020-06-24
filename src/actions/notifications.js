import { SET_NOTIFICATION, REMOVE_NOTIFICATION } from './types';
import { v4 as uuidv4 } from 'uuid';

export const addNotification = (msg, variant = 'none', waitTime = 4000) => dispatch => {
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
