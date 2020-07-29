import { useQuery, useMutation, queryCache } from 'react-query';
import { api } from 'gdd-components';
import _merge from 'lodash/merge';

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
    onMutate: claim => {
      const id = claim.id.toString();
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      queryCache.cancelQueries(['claim', id]);

      // Snapshot the previous value
      const previousClaim = queryCache.getQueryData(['claim', id]);

      // Optimistically update to the new value
      queryCache.setQueryData(['claim', id], _merge(previousClaim, claim));

      // Return a rollback function
      return () => queryCache.setQueryData(['claim', id], previousClaim);
    },
    // If the mutation fails, use the rollback function we returned above
    onError: (err, newTodo, rollback) => rollback(),

    // Always refetch after error or success:
    onSettled: claim => {
      queryCache.invalidateQueries(['claim', claim.id.toString()]);
      queryCache.invalidateQueries('claims');
    },
  });
}
