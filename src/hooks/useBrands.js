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

export function useBrand() {
  return useQuery('brand', () => {
    return api.offers.getBrand().then(res => res.data);
  });
}

export function useOffers() {
  return useQuery('offers', () => {
    return api.offers.getOffers().then(res => res.data);
  });
}
