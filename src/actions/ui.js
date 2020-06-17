import { DRAWER_TOGGLE, DRAWER_CLOSE } from 'actions/types';

export const toggleDrawer = () => dispatch => {
  dispatch({ type: DRAWER_TOGGLE });
};

export const closeDrawer = () => dispatch => {
  dispatch({ type: DRAWER_CLOSE });
};
