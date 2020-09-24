import { useQuery, useMutation } from 'react-query';
// import { api } from 'gdd-components';
import api from 'gdd-api-lib';

/****************************************************************
 * Functions that perform api calls
 */
function search(key, query) {
  return api.getUsers(query).then(res => res.data);
}

function fetchConsumerProfile(key, id) {
  return api.getSpecifiedConsumerProfile(id).then(res => res.data);
}

function updateUserProfile({ id, body }) {
  return api.setSpecifiedConsumerProfileInformation(id, body).then(res => res.data);
}

function postNewBrandUser(body) {
  return api.createBrandUser(body).then(res => res.data);
}

/****************************************************************
 * Hooks
 */

export function useSearchUsers(query) {
  return useQuery(['search_users', query], search, {
    enabled: query.email || query.phone_number,
  });
}

export function useGetUser(id, type) {
  let queryFn = fetchConsumerProfile;
  if (type === 'nonprofit') {
    // queryFn = fetchNonprofitUser;
  } else if (type === 'internal') {
    // queryFn = fetchInternalUser
  } else if (type === 'brand') {
    // queryFn = fetchBrandUser
  }
  return useQuery(['get_user', id], queryFn, { enabled: id });
}

export function useUpdateUser() {
  return useMutation(updateUserProfile);
}

export function useCreateBrandUser() {
  return useMutation(postNewBrandUser);
}
