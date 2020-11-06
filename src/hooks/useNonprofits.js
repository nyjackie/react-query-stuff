import { useQuery, useMutation, queryCache } from 'react-query';
import api from 'gdd-api-lib';

/****************************************************************
 * Functions that perform api calls
 */

/**
 * Sends a nonprofit search request to the API
 * @param {string} key
 * @param {string} query
 */
function search(key, query) {
  if (query.search_term) {
    query.search_term = window.btoa(query.search_term);
  }

  return api.internalSearchNonprofits(query).then(res => res.data);
}

/**
 * Get a single nonprofit's profile (for this internal portal only)
 * @param {string} key
 * @param {number} id nonprofit id
 */
function fetchNp(key, id) {
  return api.getInternalNonprofitProfile(id).then(res => res.data);
}

/**
 * Get nonprofit categories from the db
 */
function getCategories() {
  return api.getNonprofitCategories().then(res => res.data);
}

/**
 * Create a new Nonprofit User
 * @param {object} body
 * @param {number} nonprofit_id id of the nonprofit user works for
 * @param {string} body.first_name User's first name.
 * @param {string} body.last_name User's last name.
 * @param {string} body.email User's email.
 * @param {string} body.phone_number User's phone number.
 */
function postNewNonprofitUser(body) {
  return api.createNonprofitUser(body).then(res => res.data);
}

/**
 * Update A Nonprofit User
 * @param {number} id  REQUIRED user_id to specify which nonprofit user profile to set.
 * @param {object} body REQUIRED request body payload
 * @param {string} body.first_name User's first name.
 * @param {string} body.last_name User's last name.
 * @param {string} body.email User's email.
 * @param {string} body.phone_number User's phone number.
 */
function putUpdateUserProfile({ id, body }) {
  return api.updateNonprofitUserProfile(id, body).then(res => res.data);
}

/**
 * API handler to update a single nonprofit's logo
 * @param {object} param0
 * @param {string} param0.id
 * @param {string} param0.bytestring
 */
function updateNPOLogo({ id, bytestring }) {
  return api.setNonprofitLogo(id, { logo_image_bytestring: bytestring }).then(res => res.data);
}

/**
 * API handler to update a single nonprofit's hero/cover image
 * @param {object} param0
 * @param {string} param0.id
 * @param {string} param0.bytestring
 */
function updateNPOHero({ id, bytestring }) {
  return api.setNonprofitHero(id, { hero_image_bytestring: bytestring }).then(res => res.data);
}

/**
 * Update the Nonprofit's organization profile
 * @param {number} id  REQUIRED Id of the specified nonprofit
 * @param {object} body REQUIRED request body payload
 * @param {string} body.name Nonprofit Name
 * @param {{category_id: number}[]} body.categories List of categories that the nonprofit is associated with
 * @param {string} body.website_url Domain URL for the nonprofit
 * @param {string} body.mission A description of the nonprofit's mission
 * @param {object} body.address The address of a nonprofit
 * @param {string} body.address.address_line_1 First address line
 * @param {string} body.address.address_line_2 Second address line
 * @param {string} body.address.city City which the nonprofit resides
 * @param {string} body.address.county County which the nonprofit resides
 * @param {string} body.address.state State in which the city resides
 * @param {string} body.address.zip Zip code which the nonprofit resides
 * @param {string} body.address.msa Metropolitan Statistical Area
 * @param {string} body.address.lat_long Latitude and longitude
 * @param {boolean} body.is_banned Whether or not this nonprofit is banned
 * @param {boolean} body.is_active Whether or not the nonprofit is active
 * @param {boolean} body.is_folded Whether or not the nonprofit is folded
 * @returns {Promise}
 */
function updateNonprofitProfile({ id, body }) {
  return api.setInternalNonprofitProfile(id, body).then(res => res.data);
}

/****************************************************************
 * Hooks
 */

export function useNonprofitSearch(query) {
  return useQuery(['np_search', query], search, {
    enabled: query.search_term,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    cacheTime: 0,
    staleTime: 0,
  });
}

export function useNonprofit(id) {
  return useQuery(['np_profile', id], fetchNp, {
    enabled: id,
    refetchOnWindowFocus: false,
  });
}

export function useNpCategories() {
  return useQuery('np_categories', getCategories, {
    // these should never go stale because they will barely ever change. We
    // should definitely cache them throughout the whole session
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useCreateNoprofitUser() {
  return useMutation(postNewNonprofitUser, { throwOnError: true });
}

/**
 * @param {string} email base64 encoded email before sending
 * @param {string?|boolean} template template=new_nonprofit if using for new nonprofit user creation
 */
export function useNonprofitForgotPassword(email, template = false) {
  return useMutation(() => {
    const query = { email: window.btoa(email) };
    if (template) {
      query.template = template;
    }
    return api.nonprofitForgotPassword(query);
  });
}

export function useUpdateNonprofitUser() {
  return useMutation(putUpdateUserProfile, {
    onSuccess: (offer, variable) => {
      queryCache.invalidateQueries(['get_user', variable.id]);
    },
  });
}

/**
 * Mutation: Update the nonprofit logo
 */
export function useUpdateNPOLogo() {
  return useMutation(updateNPOLogo, {
    throwOnError: true,
    onSuccess: (data, variable) => {
      queryCache.invalidateQueries(['np_profile', variable.id]);
      queryCache.refetchQueries(['np_profile', variable.id]);
    },
  });
}

/**
 * Mutation: Update the nonprofit hero image
 */
export function useUpdateNPOHero() {
  return useMutation(updateNPOHero, {
    throwOnError: true,
    onSuccess: (data, variable) => {
      queryCache.invalidateQueries(['np_profile', variable.id]);
    },
  });
}

export function useNonprofitProfileUpdate() {
  return useMutation(updateNonprofitProfile, {
    throwOnError: true,
    onSuccess: (data, variable) => {
      queryCache.invalidateQueries(['np_profile', variable.id]);
    },
  });
}
