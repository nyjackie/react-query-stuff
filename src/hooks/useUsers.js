import { useQuery } from 'react-query';
import { api } from 'gdd-components';

/****************************************************************
 * Functions that perform api calls
 */
function search(key, term) {
  return api.users.search(term).then(res => res.data);
}

function fetchUser(key, id) {
  return api.users.getUser(id).then(res => res.data);
}

/****************************************************************
 * Hooks
 */

export function useSearchUsers(query) {
  return useQuery(['search_users', query], search, { enabled: query });
}

export function useGetUser(id) {
  return useQuery(['get_user', id], fetchUser, { enabled: id });
}
