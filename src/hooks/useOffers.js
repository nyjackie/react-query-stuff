import { useQuery } from 'react-query';
import { getOfferByGuid } from 'gdd-api-lib';

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
