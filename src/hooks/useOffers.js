import { useQuery, useMutation } from 'react-query';
import api from 'gdd-api-lib';

export function useOffer(id) {
  return useQuery(
    ['offer', id],
    () => {
      return api
        .getOfferByGuid({ offer_guid: id, offer_type: 'AFFILIATE_PROGRAM' })
        .then(res => res.data);
    },
    { staleTime: Infinity, cacheTime: Infinity }
  );
}

export function useRefreshOffer(offer_guid, offer_type) {
  return useMutation(
    () => {
      return api.internalOfferRefresh({ offer_guid, offer_type }).then(res => res.data);
    },
    {
      throwOnError: true,
    }
  );
}
