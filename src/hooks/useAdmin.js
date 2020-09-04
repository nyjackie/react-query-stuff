import { useMutation } from 'react-query';
import api from 'gdd-api-lib';

/****************************************************************
 * Functions that perform api calls
 */

function postUser(body) {
  return api.createInternalUser(body).then(res => res.data);
}

/****************************************************************
 * Hooks
 */

export function useCreateUser() {
  return useMutation(postUser);
}
