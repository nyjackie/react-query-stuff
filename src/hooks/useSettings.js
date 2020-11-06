import { useMutation } from 'react-query';
import api from 'gdd-api-lib';

function changePassword({ id, body }) {
  return api.changeInternalUserPassword(id, body).then(res => res.data);
}

/****************************************************************
 * Hooks
 */

export function useChangePassword() {
  return useMutation(changePassword, {
    throwOnError: true,
  });
}
