import { useQuery } from 'react-query';
import { api } from 'gdd-components';

/****************************************************************
 * Hooks
 */

export function useBrands() {
  return useQuery('brands', () => {
    return api.offers.getBrands().then(res => res.data);
  });
}

export function useBrand(id) {
  return useQuery(['brand', id], () => {
    return api.offers.getBrand(id).then(res => res.data);
  });
}

export function useOffers(id) {
  return useQuery(
    ['offers', id],
    () => {
      return api.offers.getOffers(id).then(res => res.data);
    },
    {
      enabled: id,
    }
  );
}
