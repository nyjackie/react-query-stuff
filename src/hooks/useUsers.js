import { useQuery, useMutation, queryCache } from 'react-query';
import api from 'gdd-api-lib';
import { USER_TYPES } from 'utils/constants';
import store from '../store';
import { addNotification } from 'actions/notifications';

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

function updateBrandUser({ id, body }) {
  return api.updateBrandUserProfile(id, body).then(res => res.data);
}

function postNewBrandUser(body) {
  return api.createBrandUser(body).then(res => res.data);
}

function fetchBrandUserProfile(key, id) {
  return api.getBrandUserProfile(id).then(res => res.data);
}

function fetchNonprofitUserProfile(key, id) {
  return api.getNonprofitUserProfile(id).then(res => res.data);
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
  // default to consumer user
  let queryFn = fetchConsumerProfile;

  if (type === USER_TYPES.NONPROFIT) {
    queryFn = fetchNonprofitUserProfile;
  } else if (type === USER_TYPES.INTERNAL) {
    // queryFn = fetchInternalUser
  } else if (type === USER_TYPES.BRAND) {
    queryFn = fetchBrandUserProfile;
  }
  return useQuery(['get_user', id], queryFn, { enabled: id });
}

export function useUpdateConsumerUser() {
  return useMutation(updateUserProfile, {
    onSuccess: (offer, variable) => {
      queryCache.invalidateQueries(['get_user', variable.id]);
    },
  });
}

export function useUpdateBrandUser() {
  return useMutation(updateBrandUser, {
    onSuccess: (offer, variable) => {
      queryCache.invalidateQueries(['get_user', variable.id]);
    },
  });
}

export function useCreateBrandUser() {
  return useMutation(postNewBrandUser);
}

export function useDeleteUser() {
  return useMutation(
    ({ id }) => {
      return api.deleteUser(id);
    },
    {
      onSuccess: (offer, variable) => {
        queryCache.invalidateQueries(['get_user', variable.id]);
        store.dispatch(addNotification('User successfully set for deletion in 30 days', 'success'));
      },
      onError: err => {
        if (err.response.status === 404) {
          store.dispatch(addNotification(`A user with that ID does not exist`, 'fail'));
        } else {
          store.dispatch(addNotification(`An Error occured: ${err.message} `, 'fail'));
        }
      },
    }
  );
}
