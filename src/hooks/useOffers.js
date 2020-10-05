import { useQuery } from 'react-query';
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