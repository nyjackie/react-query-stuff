import { useQuery } from 'react-query';
import api from 'gdd-api-lib';

/****************************************************************
 * Functions that perform api calls
 */
function search(key, query) {
  if (query.search_term) {
    query.search_term = window.btoa(query.search_term);
  }

  return api.internalSearchNonprofits(query).then(res => res.data);
}

function fetchNp(key, id) {
  return api.getNonprofit(id).then(res => res.data);
}

function getCategories() {
  return api.getNonprofitCategories().then(res => res.data);
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
  return useQuery(['np_profile', id], fetchNp, {
    enabled: id,
    refetchOnWindowFocus: false,
  });
}

export function useNpCategories() {
  return useQuery('np_categories', getCategories, {
    // these should never go stale because they will barely ever change. We
    // should definitely cache them throughout the whole session
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
