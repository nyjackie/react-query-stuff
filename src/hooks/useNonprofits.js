import { useQuery, useMutation, queryCache } from 'react-query';
import api from 'gdd-api-lib';
import store from 'store';
import { addNotification } from 'actions/notifications';

/****************************************************************
 * Functions that perform api calls
 */
function search(key, query) {
  if (query.search_term) {
    query.search_term = window.btoa(query.search_term);
  }

  return api.internalSearchNonprofits(query).then(res => res.data);
}

function fetchNp(key, id) {
  return api.getInternalNonprofitProfile(id).then(res => res.data);
}

function getCategories() {
  return api.getNonprofitCategories().then(res => res.data);
}

function postNewNonprofitUser(body) {
  return api.createNonprofitUser(body).then(res => res.data);
}

/**
 *
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
 * API handler to update a single brand's logo
 * @param {object} param0
 * @param {string} param0.id
 * @param {string} param0.bytestring
 */
function updateNPOLogo({ id, bytestring }) {
  return api.setNonprofitLogo(id, { logo_image_bytestring: bytestring }).then(res => res.data);
}

/**
 * API handler to update a single brand's hero/cover image
 * @param {object} param0
 * @param {string} param0.id
 * @param {string} param0.bytestring
 */
function updateNPOHero({ id, bytestring }) {
  return api.setNonprofitHero(id, { hero_image_bytestring: bytestring }).then(res => res.data);
}

/****************************************************************
 * Hooks
 */

export function useNonprofitSearch(query) {
  return useQuery(['np_search', query], search, {
    enabled: query.search_term,
    refetchOnWindowFocus: false,
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
  return useMutation(postNewNonprofitUser);
}

/**
 * @param {string} email base64 encoded email before sending
 * @param {string?|boolean} template template=new_nonprofit if using for new nonprofit user creation
 */
export function useNonprofitForgotPassword(email, template = false) {
  return useQuery(
    ['np_forgotPW', email],
    () => {
      const query = { email: window.btoa(email) };
      if (template) {
        query.template = template;
      }
      return api.nonprofitForgotPassword(query);
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

export function useUpdateNonprofitUser() {
  return useMutation(putUpdateUserProfile, {
    onSuccess: (offer, variable) => {
      queryCache.invalidateQueries(['get_user', variable.id]);
    },
  });
}

/**
 * Mutation: Update the brand logo
 */
export function useUpdateBrandLogo() {
  return useMutation(updateNPOLogo, {
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
  return useMutation(updateNPOHero, {
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
