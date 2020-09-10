import { useMutation } from 'react-query';
import api from 'gdd-api-lib';

// const config = {
//   cacheTime: 0,
//   retry: false,
//   staleTime: 0,
//   refetchOnWindowFocus: false,
//   refetchOnReconnect: false,
//   refetchInterval: false,
//   refetchIntervalInBackground: false,
// }

function changePassword({ id, body }) {
  return api.changeInternalUserPassword(id, body).then(res => res.data);
}

/****************************************************************
 * Hooks
 */

export function useChangePassword() {
  return useMutation(changePassword);
}
