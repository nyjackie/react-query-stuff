import { SET_NOTIFICATION, REMOVE_NOTIFICATION } from 'actions/types';

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_NOTIFICATION:
      if (payload.show) {
        return [...state, payload];
      } else {
        state.forEach(item => {
          if (item.id === payload.id) {
            item.show = payload.show;
          }
        });
        return [...state];
      }
    case REMOVE_NOTIFICATION:
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
