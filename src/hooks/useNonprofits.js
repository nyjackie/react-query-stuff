import { useQuery, useMutation, queryCache } from 'react-query';
import api from 'gdd-api-lib';

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
  return api.getNonprofit(id).then(res => res.data);
}

function getCategories() {
  return api.getNonprofitCategories().then(res => res.data);
}

function postNewNonprofitUser(body) {
  return api.createNonprofitUser(body).then(res => res.data);
}

/**
 * @param {object} query url search/query parameters
 * @param {string} query.email base64 encoded email
 * @param {boolean} query.template template=new_nonprofit if using for new nonprofit user creation
 */
function sendForgotPassword(_, { email, template = false }) {
  console.log('sendForgotPassword', _, email, template);
  return api
    .nonprofitForgotPassword({
      email: window.btoa(email),
      template,
    })
    .then(res => res.data);
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
 * @param {boolean} template template=new_nonprofit if using for new nonprofit user creation
 */
export function useNonprofitForgotPassword(email, template = false) {
  return useQuery(
    ['np_forgotPW', email],
    () => {
      return api.nonprofitForgotPassword({
        email: window.btoa(email),
        template,
      });
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
