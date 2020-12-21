import { usePaginatedQuery, useQuery, useMutation, queryCache } from 'react-query';
import store from 'store';
import { setNotification } from 'actions/notifications';
import {
  internalSearchBrands,
  setBrandLogo,
  setBrandHero,
  upsertOfferBucket,
  getBrandCategories,
  getInternalOfferBuckets,
  deleteOfferBucket,
  getQueuedBrands,
  subindustryToCategory,
  getInternalBrandInformation,
  getInternalBrandCategories,
  internalGetOffersInCategory,
  getOffersByBrandId,
  setBrandCategoryPriority,
  setInternalBrandCategory,
  brandForgotPassword,
  editInternalBrandInformation,
  editBrandOffer,
} from 'gdd-api-lib/dist/api-lib';

/**
 * API handler to update a single brand's profile info
 * @param {object} param0
 * @param {string} param0.id
 * @param {object} param0.form form data
 */
function updateBrand({ id, form }) {
  return editInternalBrandInformation(id, form).then(res => res.data);
}

/**
 * API handler to update a single brand offer. The form data contains the guid of the offer
 * that is currently being updated
 * @param {object} param0
 * @param {object} param0.form form dat
 */
function updateOffer({ form }) {
  return editBrandOffer(form).then(res => {
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
  return internalSearchBrands(query).then(res => res.data);
}

/**
 * API handler to update a single brand's logo
 * @param {object} param0
 * @param {string} param0.id
 * @param {string} param0.bytestring
 */
function updateBrandLogo({ id, bytestring }) {
  return setBrandLogo(id, { logo_image_bytestring: bytestring }).then(res => res.data);
}

/**
 * API handler to update a single brand's hero/cover image
 * @param {object} param0
 * @param {string} param0.id
 * @param {string} param0.bytestring
 */
function updateBrandHero({ id, bytestring }) {
  return setBrandHero(id, { hero_image_bytestring: bytestring }).then(res => res.data);
}

/**
 * Creates a new offer bucket or updates existing
 * @param {object} param.form form data
 */
function updateBucket({ form }) {
  return upsertOfferBucket(form).then(res => res.data);
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
      return getBrandCategories().then(res => res.data);
    },
    {
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );
}

export function useBuckets() {
  return useQuery('buckets', () => {
    return getInternalOfferBuckets({ include_inactive: true }).then(res => res.data);
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
      return deleteOfferBucket(id);
    },
    {
      onSuccess: () => {
        queryCache.invalidateQueries('buckets');
        store.dispatch(setNotification('Bucket deleted', 'info'));
      },
      onError: err => {
        if (err.response.status === 404) {
          store.dispatch(setNotification(`A bucket with that ID does not exist`, 'error'));
        } else {
          store.dispatch(setNotification(`An Error occured: ${err.message} `, 'error'));
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
    return getQueuedBrands({ offset, limit: 10 }).then(res => res.data);
  });
}

/**
 * Get the data for a single brand
 * @param {number} id brand's unique id from our db
 */

export function useCESubID(id) {
  return useQuery(
    ['ce_subindustry_id', id],
    () => subindustryToCategory(id).then(res => res.data),
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
      return getInternalBrandInformation(id).then(res => res.data);
    },
    {
      enabled: id,
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Get Brand Categories
 */
export function useBrandCategories() {
  return useQuery(
    'internal_brands_categories',
    () => {
      return getInternalBrandCategories().then(res => res.data);
    },
    { staleTime: Infinity, cacheTime: Infinity, refetchOnWindowFocus: false }
  );
}

export function useInternalBrandsInCategory(id, offset) {
  return usePaginatedQuery(
    ['internal_brands_category', id, offset],
    () => {
      return internalGetOffersInCategory(id, { offset, limit: 8 }).then(res => res.data);
    },
    {
      enabled: id,
      staleTime: Infinity,
      cacheTime: Infinity,
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
      return getOffersByBrandId(id).then(res => res.data);
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
      queryCache.invalidateQueries(['brand', String(variable.id)]);
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
      queryCache.invalidateQueries(['offers', String(variable.brand_id)]);
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

    onSuccess: (data, variable) => {
      queryCache.invalidateQueries(['brand', String(variable.id)]);
      store.dispatch(setNotification('Logo image uploaded.', 'success'));
    },
  });
}

/**
 * Mutation: Update the brand hero image
 */
export function useUpdateBrandHero() {
  return useMutation(updateBrandHero, {
    throwOnError: true,

    onSuccess: (data, variable) => {
      queryCache.invalidateQueries(['brand', String(variable.id)]);
      store.dispatch(setNotification('Hero image uploaded.', 'success'));
    },
  });
}

/**
 * Mutation: Update the brand category
 */
export function useUpdateInternalBrandCategories() {
  return useMutation(doSetInternalBrandCategory, {
    throwOnError: true,
  });
}

export function useUpdateInternalBrandCategoryPriority() {
  return useMutation(doSetBrandCategoryPriority, {
    throwOnError: true,
    onSuccess: (data, variable) => {
      queryCache.invalidateQueries(['internal_brands_category', variable.category_id]);
    },
  });
}

function doSetBrandCategoryPriority({ category_id, body }) {
  return setBrandCategoryPriority(body).then(res => res.data);
}

function doSetInternalBrandCategory({ id, body }) {
  return setInternalBrandCategory(id, body).then(res => res.data);
}

/**
 * @param {string} email base64 encoded email before sending
 * @param {string?|boolean} template template=new_brand
 */
export function useBrandForgotPassword(email, template = false) {
  return useMutation(() => {
    const query = { email: window.btoa(email) };
    if (template) {
      query.template = template;
    }
    return brandForgotPassword(query);
  });
}
