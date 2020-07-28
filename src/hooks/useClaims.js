import { useQuery, useMutation, queryCache } from 'react-query';
import { api } from 'gdd-components';

/****************************************************************
 * Functions that perform api calls
 */
function fetchClaim(key, claimId) {
  return api.claims.getSingle(claimId).then(res => res.data);
}

function updateClaim({ id, status, note }) {
  if (status === 'approve') {
    return api.claims.approve(id, note).then(res => res.data.data);
  }
  return api.claims.deny(id, note).then(res => res.data.data);
}

/****************************************************************
 * Hooks
 */

export function useClaims() {
  return useQuery('claims', () => {
    return api.claims.getAll().then(res => res.data);
  });
}

export function useClaim(claimId) {
  return useQuery(['claim', claimId], fetchClaim, { enabled: claimId });
}

export function useUpdateClaim() {
  return useMutation(updateClaim, {
    onSuccess: () => {
      queryCache.invalidateQueries('claims');
    },
  });
}
