import claimsService from 'services/claims.service';
// import api from '../utils/api';

import {
  CLAIMS_REQUEST,
  GET_CLAIMS_SUCCESS,
  GET_CLAIM_SUCCESS,
  DENY_CLAIM_SUCCESS,
  APPROVE_CLAIM_SUCCESS,
  CLAIMS_ERROR,
  // CREATE_CLAIM,
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
  try {
    const [err, data] = await claimsService.getClaim(id);
    // const res = await api.get(`/claims/${id}`);
    // const [err, data] = await userService.getClaim(id);
    if (data) {
      dispatch({
        type: GET_CLAIM_SUCCESS,
        payload: data.data,
      });
    } else {
      dispatch({
        type: CLAIMS_ERROR,
        // payload: { msg: err.response.msg, status: err.response.status },
      });
    }
  } catch (err) {
    dispatch({
      type: CLAIMS_ERROR,
      // payload: { msg: err.response.msg, status: err.response.status },
    });
  }
};

export const denyClaim = id => async dispatch => {
  console.log('we are in deny claim');
  return ' ';
  dispatch({
    type: CLAIMS_REQUEST,
  });
  try {
    // await api.delete(`/claims/${id}`);
    // await userService.deleteClaim(id)
    dispatch({
      type: DENY_CLAIM_SUCCESS,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: CLAIMS_ERROR,
      payload: { msg: err.response.msg, status: err.response.status },
    });
  }
};

export const approveClaim = id => async dispatch => {
  console.log('we are in approve claim section', id);
  return ' ';
  dispatch({
    type: CLAIMS_REQUEST,
  });
  try {
    // await api.put(`/claims/${id}`);
    // await userService.approveClaim(id)
    dispatch({
      type: APPROVE_CLAIM_SUCCESS,
      payload: id,
    });
  } catch (err) {
    dispatch({
      type: CLAIMS_ERROR,
      payload: { msg: err.response.msg, status: err.response.status },
    });
  }
};
