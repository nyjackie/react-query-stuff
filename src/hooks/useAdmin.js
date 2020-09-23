import { useMutation } from 'react-query';
import api from 'gdd-api-lib';

export const USER_TYPES = {
  CONSUMER: 'consumer',
  NONPROFIT: 'nonprofit',
  BRAND: 'brand',
  INTERNAL: 'internal',
};

/****************************************************************
 * Functions that perform api calls
 */

function postUser(body) {
  return api.createInternalUser(body).then(res => res.data);
}

/**
 * checks an email for unique per portal
 * @param {object} body
 * @param {string} body.email the user's email
 * @param {string} body.user_type one of the USER_TYPES constants
 */
function uniqueEmail(body) {
  return api.checkUniqueEmail(body).then(res => res.data);
}

/**
 * checks a phone number for unique per portal
 * @param {object} body
 * @param {string} body.phone_number the user's email
 * @param {string} body.user_type one of the USER_TYPES constants
 */
function uniquePhone(body) {
  return api.checkUniquePhone(body).then(res => res.data);
}

/****************************************************************
 * Hooks
 */

export function useCreateUser() {
  return useMutation(postUser);
}

export function useUniqueEmail() {
  return useMutation(uniqueEmail);
}

export function useUniquePhone() {
  return useMutation(uniquePhone);
}
