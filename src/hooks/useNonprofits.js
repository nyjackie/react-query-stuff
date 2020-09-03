import { useQuery } from 'react-query';
import api from 'gdd-api-lib';

/****************************************************************
 * Functions that perform api calls
 */
function search(key, query) {
  if (query.search_term) {
    query.search_term = window.btoa(query.search_term);
  }
  return api.searchNonprofits(query).then(res => res.data);
}

function fetchNp(key, id) {
  return api.getNonprofit(id).then(res => res.data);
}

/****************************************************************
 * Hooks
 */

export function useNonprofitSearch(query) {
  return useQuery(['np_search', query], search, {
    enabled: query.search_term,
    refetchOnWindowFocus: false,
  });
}

export function useNonprofit(id) {
  return useQuery(['np_profile', id], fetchNp, { enabled: id });
}
