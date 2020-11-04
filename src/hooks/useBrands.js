import { usePaginatedQuery, useQuery, useMutation, queryCache } from 'react-query';
import api from 'gdd-api-lib';
import store from 'store';
import { addNotification } from 'actions/notifications';

/**
 * API handler to update a single brand's profile info
 * @param {object} param0
 * @param {string} param0.id
 * @param {object} param0.form form data
 */
function updateBrand({ id, form }) {
  return api.editInternalBrandInformation(id, form).then(res => res.data);
}

/**
 * API handler to update a single brand offer. The form data contains the guid of the offer
 * that is currently being updated
 * @param {object} param0
 * @param {object} param0.form form dat
 */
function updateOffer({ form }) {
  return api.editBrandOffer(form).then(res => {
    return res.data;
  });
}

/**
 * API handler to search for brands by name
 * @param {string} key
 * @param {string} query
 */
function search(key, query) {
  if (query.search_term) {
    query.search_term = window.btoa(query.search_term);
  }
  return api.internalSearchBrands(query).then(res => res.data);
}

/**
 * API handler to update a single brand's logo
 * @param {object} param0
 * @param {string} param0.id
 * @param {string} param0.bytestring
 */
function updateBrandLogo({ id, bytestring }) {
  return api.setBrandLogo(id, { logo_image_bytestring: bytestring }).then(res => res.data);
}

/**
 * API handler to update a single brand's hero/cover image
 * @param {object} param0
 * @param {string} param0.id
 * @param {string} param0.bytestring
 */
function updateBrandHero({ id, bytestring }) {
  return api.setBrandHero(id, { hero_image_bytestring: bytestring }).then(res => res.data);
}

/**
 * Creates a new offer bucket or updates existing
 * @param {object} param.form form data
 */
function updateBucket({ form }) {
  return api.upsertOfferBucket(form).then(res => res.data);
}

/*********************************************
 * exported hooks
 */

/**
 * Get all brand categories. Store in cache once for the entire session
 */
export function useCategories() {
  return useQuery(
    'categories',
    () => {
      return api.getBrandCategories().then(res => res.data);
    },
    {
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );
}

export function useBuckets() {
  return useQuery('buckets', () => {
    return api.getInternalOfferBuckets({ include_inactive: true }).then(res => res.data);
  });
}

/**
 *  Creates a new offer bucket or updates existing
 */
export function useUpdateBucket() {
  return useMutation(updateBucket, {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries('buckets');
    },
  });
}

/**
 *  Creates a new offer bucket or updates existing
 */
export function useDeleteBucket() {
  return useMutation(
    id => {
      return api.deleteOfferBucket(id);
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries('buckets');
        store.dispatch(addNotification('Bucket deleted', 'info'));
      },
      onError: err => {
        if (err.response.status === 404) {
          store.dispatch(addNotification(`A bucket with that ID does not exist`, 'error'));
        } else {
          store.dispatch(addNotification(`An Error occured: ${err.message} `, 'error'));
        }
      },
    }
  );
}

/**
 * query to get paginated grooming queue
 * @param {number} offset
 */
export function useBrandGroomingQueue(offset = 0) {
  return usePaginatedQuery(['brands', offset], () => {
    return api.getQueuedBrands({ offset, limit: 10 }).then(res => res.data);
  });
}

/**
 * Get the data for a single brand
 * @param {number} id brand's unique id from our db
 */

export function useCESubID(id) {
  return useQuery(
    ['ce_subindustry_id', id],
    () => api.subindustryToCategory(id).then(res => res.data),
    {
      enabled: id,
      manual: true,
    }
  );
}

/**
 * Get the data for a single brand
 * @param {number} id brand's unique id from our db
 */
export function useBrand(id) {
  return useQuery(
    ['brand', id],
    () => {
      return api.getInternalBrandInformation(id).then(res => res.data);
    },
    {
      enabled: id,
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Get all of the offers for a specific brand
 * @param {number} id brand's unique id from our db
 */
export function useOffers(id) {
  return useQuery(
    ['offers', id],
    () => {
      return api.getOffersByBrandId(id).then(res => res.data);
    },
    {
      enabled: id,
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Update a single brand's profile information
 */
export function useUpdateBrand() {
  return useMutation(updateBrand, {
    throwOnError: true,
    onSuccess: (data, variable) => {
      queryCache.invalidateQueries(['brand', variable.id]);
    },
  });
}

/**
 * Update a single offer
 */
export function useUpdateOffer() {
  return useMutation(updateOffer, {
    throwOnError: true,
    onSuccess: (offer, variable) => {
      queryCache.invalidateQueries(['offers', variable.brand_id]);
    },
  });
}

/**
 * Query to search brands
 * @param {string} query
 */
export function useBrandSearch(query) {
  return useQuery(['brand_search', query], search, {
    enabled: query.search_term,
    refetchOnWindowFocus: false,
  });
}

/**
 * Mutation: Update the brand logo
 */
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
      queryCache.refetchQueries(['brand', variable.id]);
      store.dispatch(addNotification('Logo image uploaded.', 'success'));
    },
  });
}

/**
 * Mutation: Update the brand hero image
 */
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
      queryCache.invalidateQueries(['brand', variable.id]);
      store.dispatch(addNotification('Hero image uploaded.', 'success'));
    },
  });
}

/**
 * @param {string} email base64 encoded email before sending
 * @param {string?|boolean} template template=new_brand
 */
export function useBrandForgotPassword(email, template = false) {
  return useQuery(
    ['brand_forgotPW', email],
    () => {
      const query = { email: window.btoa(email) };
      if (template) {
        query.template = template;
      }
      return api.brandForgotPassword(query);
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      cacheTime: 0,
      staleTime: 0,
      enabled: email,
      retry: false,
      onError: console.error,
    }
  );
}
