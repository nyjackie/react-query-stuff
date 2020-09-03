import { useQuery, useMutation, queryCache } from 'react-query';
import { api } from 'gdd-components';

/****************************************************************
 * Hooks
 */

function updateBrand({ id, form }) {
  console.log(form);

  return api.offers.updateBrand(id, form).then(res => res.data);
}

function updateOffer({ form }) {
  console.log('formdata', form);
  return api.offers.updateOffer(form).then(res => {
    return res.data;
  });
}

// GET
export function useCategories() {
  return useQuery('categories', () => {
    return api.offers.getCategories().then(res => res.data);
  });
}

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
export function useNonprofitName(id) {
  return useQuery(
    ['nonprofitName', id],
    () => {
      return api.offers.searchNonprofit(id);
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

export function useUpdateOffer() {
  return useMutation(updateOffer, {
    onSuccess: (offer, variable) => {
      queryCache.invalidateQueries(['offers', variable.brand_id]);
    },
  });
}
