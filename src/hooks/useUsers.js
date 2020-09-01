import { useQuery } from 'react-query';
// import { api } from 'gdd-components';
import api from 'gdd-api-lib';

/****************************************************************
 * Functions that perform api calls
 */
function search(key, query) {
  return api.getUsers(query).then(res => res.data);
}

function fetchConsumerProfile(key, id) {
  const num = parseInt(id, 10);
  return api.getSpecifiedConsumerProfile(num).then(res => res.data);
}

/****************************************************************
 * Hooks
 */

export function useSearchUsers(query) {
  return useQuery(['search_users', query], search, {
    enabled: query.email || query.phone_number,
  });
}

export function useGetUser(id, type) {
  let fetcher = fetchConsumerProfile;
  if (type === 'nonprofit') {
    // fetcher = fetchNonprofitUser;
  } else if (type === 'internal') {
    // fetcher = fetchInternalUser
  } else if (type === 'brand') {
    // fetcher = fetchBrandUser
  }
  return useQuery(['get_user', id], fetcher, { enabled: id });
}
