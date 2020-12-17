import { useQuery, useMutation, queryCache } from 'react-query';
import api from 'gdd-api-lib';

export function useTransactions(limit = 10, offset = 0, offer_activation_id, user_id, gd_status) {
  return useQuery(
    ['transaction', limit, offset, offer_activation_id, user_id, gd_status],
    () => {
      try {
        const config = {};
        config.params = new URLSearchParams({ offer_activation_id, user_id, limit, offset });
        gd_status.forEach(stat => {
          config.params.append('gd_status', stat);
        });
        return api.getAffiliateTransactions(null, null, config).then(res => res.data);
      } catch (err) {
        return {};
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );
}

export function useUpdateTransaction() {
  return useMutation(updateAffiliateTransactionsGDStatus, {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries('transaction');
    },
  });
}

function updateAffiliateTransactionsGDStatus({ gd_status, transaction_guid }) {
  return api
    .updateAffiliateTransactionsGDStatus({ gd_status, transaction_guid })
    .then(res => res.data);
}
