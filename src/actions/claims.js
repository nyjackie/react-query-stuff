import claimsService from 'services/claims.service';
import {
  CLAIMS_REQUEST,
  GET_CLAIMS_SUCCESS,
  GET_CLAIM_SUCCESS,
  DENY_CLAIM_SUCCESS,
  APPROVE_CLAIM_SUCCESS,
  CLAIMS_ERROR,
} from './types';

export const getClaims = () => async dispatch => {
  dispatch({
    type: CLAIMS_REQUEST,
  });

  const [err, data] = await claimsService.getClaims();
  if (data) {
    dispatch({
      type: GET_CLAIMS_SUCCESS,
      payload: data.data,
    });
    return;
  }
  if (err) {
    dispatch({
      type: CLAIMS_ERROR,
      // payload: { msg: err.response.msg, status: err.response.status }
    });
  }
};

export const getClaim = id => async dispatch => {
  dispatch({
    type: CLAIMS_REQUEST,
  });

  const [err, data] = await claimsService.getClaim(id);

  if (err) {
    dispatch({
      type: CLAIMS_ERROR,
    });
    return;
  }

  if (data) {
    dispatch({
      type: GET_CLAIM_SUCCESS,
      payload: data.data,
    });
    return;
  }
};

export const denyClaim = (id, history, msg) => async dispatch => {
  dispatch({
    type: CLAIMS_REQUEST,
  });
  try {
    console.log('deny msg', msg);
    dispatch({
      type: DENY_CLAIM_SUCCESS,
      payload: id,
    });
    history.push('/claims');
  } catch (err) {
    dispatch({
      type: CLAIMS_ERROR,
      payload: { msg: err.response.msg, status: err.response.status },
    });
  }
};

export const approveClaim = (id, history, msg) => async dispatch => {
  console.log('approve msg', msg);
  dispatch({
    type: CLAIMS_REQUEST,
  });
  try {
    dispatch({
      type: APPROVE_CLAIM_SUCCESS,
      payload: id,
    });
    history.push('/claims');
  } catch (err) {
    dispatch({
      type: CLAIMS_ERROR,
      payload: { msg: err.response.msg, status: err.response.status },
    });
  }
};
