import {
  GET_CLAIMS_SUCCESS, //<---Get all claims
  GET_CLAIM_SUCCESS, //<--- Get single claim
  DENY_CLAIM_SUCCESS, //<--- Dissapprove/Remove claim
  APPROVE_CLAIM_SUCCESS, //<--- guess what it does
  CLAIMS_ERROR,
  CLEAR_STATE,
} from '../actions/types';

const initialState = {
  claims: [],
  claim: null,
  error: {}, // <--- Do we need this?
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_CLAIMS_SUCCESS:
      return {
        ...state,
        claims: payload,
      };
    case GET_CLAIM_SUCCESS:
      return {
        ...state,
        claim: payload,
      };

    //approve and delete will do the same, remove it from claims list, but will make different api calls.
    case APPROVE_CLAIM_SUCCESS:
    case DENY_CLAIM_SUCCESS:
      return {
        ...state,
        claims: state.claims.filter(claim => claim._id !== payload),
      };

    case CLEAR_STATE:
      return {
        claims: [],
        ...state,
      };

    case CLAIMS_ERROR:
    default:
      return state;
  }
}
