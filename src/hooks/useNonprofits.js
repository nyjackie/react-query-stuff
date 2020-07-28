import { useQuery } from 'react-query';
import { api } from 'gdd-components';

/****************************************************************
 * Functions that perform api calls
 */
function search(key, term) {
  return api.nonprofit.search(term).then(res => res.data);
}

function fetchNp(key, id) {
  return api.claims.getSingle(id).then(res => res.data);
}

/****************************************************************
 * Hooks
 */

export function useNonprofitSearch(term) {
  return useQuery(['np_search', term], search, { enabled: term });
}

export function useNonprofit(id) {
  return useQuery(['np_profile', id], fetchNp, { enabled: id });
}
