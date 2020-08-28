import { useQuery } from 'react-query';
import api from 'gdd-api-lib';

/****************************************************************
 * Functions that perform api calls
 */
function search(key, term) {
  return api.searchNonprofits({ search_term: encodeURIComponent(term) }).then(res => res.data);
}

function fetchNp(key, id) {
  return api.getNonprofit(id).then(res => res.data);
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
