import { useQuery, useMutation, queryCache } from 'react-query';
import { CLAIM_STATUS } from 'utils/constants';
import {
  getNonprofitClaimRequestInfoOptions,
  getNonprofitClaimsByStatus,
  requestNonprofitClaimInfo,
  approveNonprofitClaim,
  denyNonprofitClaim,
} from 'gdd-api-lib/dist/api-lib';

export function useClaimOptions() {
  return useQuery(
    'claim_opts',
    () => {
      return getNonprofitClaimRequestInfoOptions().then(res => res.data);
    },
    {
      // these options wont ever change during a session so we can cache them the
      // lifetime of the browser session
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Get all items in the queue
 * @param {number} [limit] How many nonprofit claims to be returned (max 100). Defaults to 10
 * @param {number} [offset] Where to start in result set for limit. Defaults to 0
 * @param {string[]} [status] one of nonprofit claim status [PENDING, APPROVED, DENIED, SUBMITTED]. Defaults to PENDING
 */
export function useClaims(
  limit = 10,
  offset = 0,
  status = [CLAIM_STATUS.PENDING, CLAIM_STATUS.SUBMITTED]
) {
  return useQuery(
    ['claims', limit, offset, status],
    () => {
      const config = {};
      config.params = new URLSearchParams({ limit, offset });
      status.forEach(stat => {
        config.params.append('status', stat);
      });
      return getNonprofitClaimsByStatus(null, null, config).then(res => res.data);
    },
    {
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Send Claim request more info which requires one of the options from
 * useClaimOptions
 * @param {object} param0
 * @param {number} param0.claim_id  REQUIRED
 * @param {string} param0.template_name REQUIRED Name of the email template to send to the claim
 * maker. This comes from the Request Info Options
 */
function sendRequest({ claim_id, template_name }) {
  return requestNonprofitClaimInfo(claim_id, { template_name }).then(res => res.data);
}

export function useRequestInfo() {
  return useMutation(sendRequest, {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries('claims');
    },
  });
}

/**
 * Approve a claim
 * @param {number} claim_id  REQUIRED
 */
function approveClaim(claim_id) {
  return approveNonprofitClaim(claim_id).then(res => res.data);
}
export function useApproveClaim() {
  return useMutation(approveClaim, {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries('claims');
    },
  });
}

/**
 * Deny a claim
 * @param {number} claim_id  REQUIRED
 */
function denyClaim(claim_id) {
  return denyNonprofitClaim(claim_id).then(res => res.data);
}
export function useDenyClaim() {
  return useMutation(denyClaim, {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries('claims');
    },
  });
}
