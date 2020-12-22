import { getOfferByGuid, internalOfferRefresh } from 'gdd-api-lib';
import { useQuery, useMutation, queryCache } from 'react-query';

export function useOffer(id) {
  return useQuery(
    ['offer', id],
    () => {
      return getOfferByGuid({ offer_guid: id, offer_type: 'AFFILIATE_PROGRAM' }).then(
        res => res.data
      );
    },
    { staleTime: Infinity, cacheTime: Infinity }
  );
}

export function useRefreshOffer(offer_guid, offer_type, brand_id) {
  return useMutation(
    () => {
      return internalOfferRefresh({ offer_guid, offer_type }).then(res => res.data);
    },
    {
      throwOnError: true,
      onSuccess: () => {
        queryCache.invalidateQueries(['offers', brand_id]);
      },
    }
  );
}
