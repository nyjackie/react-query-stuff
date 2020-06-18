import claimsService from 'services/claims.service';
// import api from '../utils/api';

import {
  CLAIMS_REQUEST,
  GET_CLAIMS_SUCCESS,
  GET_CLAIM_SUCCESS,
  DELETE_CLAIM_SUCCESS,
  APPROVE_CLAIM_SUCCESS,
  CLAIMS_ERROR,
  // CREATE_CLAIM,
} from './types';

export const getClaims = () => async dispatch => {
  console.log('are we in claims?');

  dispatch({
    type: CLAIMS_REQUEST,
  });

  const [err, data] = await claimsService.getClaims();
  if (data) {
    console.log('data', err, data);
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
    console.log('in here?', data);
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

export const deleteClaim = id => async dispatch => {
  dispatch({
    type: CLAIMS_REQUEST,
  });
  try {
    // await api.delete(`/claims/${id}`);
    // await userService.deleteClaim(id)
    dispatch({
      type: DELETE_CLAIM_SUCCESS,
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
