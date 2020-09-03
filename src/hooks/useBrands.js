import { useQuery, useMutation, queryCache } from 'react-query';
import { api } from 'gdd-components';

/****************************************************************
 * Hooks
 */

function updateBrand({ id, form }) {
  return api.offers.updateBrand(id, form).then(res => res.data);
  // console.log('put data', id, form);
  // return {};
}

// GET

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

// PUT

export function useUpdateBrand() {
  return useMutation(updateBrand);
}
