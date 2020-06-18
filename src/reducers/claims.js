import {
  GET_CLAIMS_SUCCESS, //<---Get all claims
  GET_CLAIM_SUCCESS, //<--- Get single claim
  DELETE_CLAIM_SUCCESS, //<--- Dissapprove/Remove claim
  APPROVE_CLAIM_SUCCESS, //<--- guess what it does
  CLAIMS_ERROR,
  // CREATE_CLAIM_SUCCESS   //* Do we need this? */
} from '../actions/types';

const initialState = {
  claims: [],
  claim: null,
  loading: true,
  error: {}, // <--- Do we need this?
};

export default function (state = initialState, action) {
  console.log('hereee', action);
  const { type, payload } = action;
  switch (type) {
    case GET_CLAIMS_SUCCESS:
      return {
        ...state,
        claims: payload,
        loading: false,
      };
    case GET_CLAIM_SUCCESS:
      return {
        ...state,
        claim: payload,
        loading: false,
      };

    //approve and delete will do the same, remove it from claims list, but will make different api calls.
    case APPROVE_CLAIM_SUCCESS:
    case DELETE_CLAIM_SUCCESS:
      return {
        ...state,
        claims: state.claims.filter(claim => claim._id !== payload),
        loading: false,
      };

    // DO WE NEED THIS?
    // case CREATE_CLAIM_SUCCESS:
    //     return {
    //         ...state,
    //         claims: [payload, ...state.claims],
    //         loading: false
    //     }
    case CLAIMS_ERROR:
    default:
      return state;
  }
}
