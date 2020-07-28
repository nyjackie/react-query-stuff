import { useQuery, useMutation, queryCache } from 'react-query';
import { api } from 'gdd-components';
import { updateCollection } from 'utils';

/****************************************************************
 * Functions that perform api calls
 */
function fetchClaim(key, claimId) {
  return api.claims.getSingle(claimId).then(res => res.data);
}

function updateClaim({ id, status, note }) {
  if (status === 'approve') {
    return api.claims.approve(id, note).then(res => res.data);
  }
  return api.claims.deny(id, note).then(res => res.data);
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
    onSuccess: (data, variables) => {
      queryCache.setQueryData('claims', old => {
        return updateCollection(old, 'id', data);
      });
    },
  });
}
