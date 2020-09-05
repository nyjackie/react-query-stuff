import { usePaginatedQuery, useQuery, useMutation, queryCache } from 'react-query';
import api from 'gdd-api-lib';

/****************************************************************
 * Hooks
 */

function updateBrand({ id, form }) {
  return api.editBrand(id, form).then(res => res.data);
}

function updateOffer({ form }) {
  return api.editBrandOffer(form).then(res => {
    return res.data;
  });
}

// GET
export function useCategories() {
  return useQuery(
    'categories',
    () => {
      return api.getBrandCategories().then(res => res.data);
    },
    {
      cacheTime: Infinity,
    }
  );
}

export function useBrands(offset = 0) {
  return usePaginatedQuery(['brands', offset], () => {
    return api.getRawBrands({ offset, limit: 10 }).then(res => res.data);
  });
}

export function useBrand(id) {
  return useQuery(['brand', id], () => {
    return api.getBrand(id).then(res => res.data);
  });
}

export function useOffers(id) {
  return useQuery(
    ['offers', id],
    () => {
      return api.getBrandOffer(id).then(res => res.data);
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
