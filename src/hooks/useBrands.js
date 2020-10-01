import { usePaginatedQuery, useQuery, useMutation, queryCache } from 'react-query';
import api from 'gdd-api-lib';
import store from 'store';
import { addNotification } from 'actions/notifications';

function updateBrand({ id, form }) {
  return api.editInternalBrandInformation(id, form).then(res => res.data);
}

function updateOffer({ form }) {
  return api.editBrandOffer(form).then(res => {
    return res.data;
  });
}

function search(key, query) {
  if (query.search_term) {
    query.search_term = window.btoa(query.search_term);
  }
  return api.internalSearchBrands(query).then(res => res.data);
}

function updateBrandLogo({ id, logo_image_bytestring }) {
  return api.setBrandLogo(id, { logo_image_bytestring }).then(res => res.data);
}

function updateBrandHero({ id, hero_image_bytestring }) {
  return api.setBrandHero(id, { hero_image_bytestring }).then(res => res.data);
}

/*********************************************
 * exported hooks
 */

// Get all brand categories
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

export function useBrandSearch(query) {
  return useQuery(['brand_search', query], search, {
    enabled: query.search_term,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateBrandLogo() {
  return useMutation(updateBrandLogo, {
    throwOnError: true,
    onError: err => {
      store.dispatch(
        addNotification(
          `Logo upload failed: ${err.message}: ${err.response?.data?.message}`,
          'error'
        )
      );
    },
    onSuccess: (data, variable) => {
      queryCache.invalidateQueries(['brand', variable.id]);
      store.dispatch(addNotification('Logo image uploaded.', 'success'));
    },
  });
}

export function useUpdateBrandHero() {
  return useMutation(updateBrandHero, {
    throwOnError: true,
    onError: err => {
      store.dispatch(
        addNotification(
          `Cover upload failed: ${err.message}: ${err.response?.data?.message}`,
          'error'
        )
      );
    },
    onSuccess: (data, variable) => {
      queryCache.invalidateQueries(['brand', variable.brand_id]);
      store.dispatch(addNotification('Hero image uploaded.', 'success'));
    },
  });
}
