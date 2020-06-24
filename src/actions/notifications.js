import { SET_NOTIFICATION, REMOVE_NOTIFICATION } from './types';
import { v4 as uuidv4 } from 'uuid';
export const setNotification = (msg, id = uuidv4(), show = true, waitTime = 4000) => dispatch => {
  dispatch({
    type: SET_NOTIFICATION,
    payload: { msg, id, show },
  });
  setTimeout(() => {
    show = false;
    dispatch({
      type: SET_NOTIFICATION,
      payload: { msg, id, show },
    });
  }, waitTime);
  setTimeout(
    () =>
      dispatch({
        type: REMOVE_NOTIFICATION,
        payload: id,
      }),
    waitTime + 1500
  );
};

export const removeNotification = id => dispatch => {
  dispatch({
    type: REMOVE_NOTIFICATION,
    payload: id,
  });
};
