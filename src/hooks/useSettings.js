import { useMutation } from 'react-query';
import { changeInternalUserPassword } from 'gdd-api-lib';

function changePassword({ id, body }) {
  return changeInternalUserPassword(id, body).then(res => res.data);
}

/****************************************************************
 * Hooks
 */

export function useChangePassword() {
  return useMutation(changePassword, {
    throwOnError: true,
  });
}
