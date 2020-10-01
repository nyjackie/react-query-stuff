import { usePaginatedQuery, useQuery, useMutation, queryCache } from 'react-query';
import api from 'gdd-api-lib';

/****************************************************************
 * Hooks
 */

function updateBrand({ id, form }) {
  return api.editInternalBrandInformation(id, form).then(res => res.data);
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

export function useBuckets() {
  return useQuery('buckets', () => {
    return api.getOfferBuckets().then(res => res.data);
  });
}

export function useBrands(offset = 0) {
  return usePaginatedQuery(['brands', offset], () => {
    return api.getQueuedBrands({ offset, limit: 10 }).then(res => res.data);
  });
}

export function useBrand(id) {
  return useQuery(
    ['brand', id],
    () => {
      return api.getInternalBrandInformation(id).then(res => res.data);
    },
    {
      enabled: id,
    }
  );
}

export function useOffers(id) {
  return useQuery(
    ['offers', id],
    () => {
      return api.getAllBrandsOffers(id).then(res => res.data);
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

function search(key, query) {
  if (query.search_term) {
    query.search_term = window.btoa(query.search_term);
  }
  return api.internalSearchBrands(query).then(res => res.data);
}

export function useBrandSearch(query) {
  return useQuery(['brand_search', query], search, {
    enabled: query.search_term,
    refetchOnWindowFocus: false,
  });
}
