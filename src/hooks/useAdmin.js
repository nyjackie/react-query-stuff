import { useMutation } from 'react-query';
import { api } from 'gdd-components';

/****************************************************************
 * Functions that perform api calls
 */

function postUser(body) {
  return api.admin.createAdminUser(body).then(res => res.data);
}

/****************************************************************
 * Hooks
 */

export function useCreateUser() {
  return useMutation(postUser);
}
