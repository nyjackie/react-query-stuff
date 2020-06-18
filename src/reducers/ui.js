import { DRAWER_TOGGLE, DRAWER_CLOSE } from 'actions/types';

const initialState = {
  drawerOpen: false,
};

export default function (state = initialState, action) {
  const { type } = action;
  switch (type) {
    case DRAWER_TOGGLE:
      return {
        ...state,
        drawerOpen: !state.drawerOpen,
      };
    case DRAWER_CLOSE:
      return {
        ...state,
        drawerOpen: false,
      };
    default:
      return state;
  }
}
