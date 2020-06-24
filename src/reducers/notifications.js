import { SET_NOTIFICATION, REMOVE_NOTIFICATION } from 'actions/types';

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_NOTIFICATION:
      return [...state, payload];
    case REMOVE_NOTIFICATION:
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
