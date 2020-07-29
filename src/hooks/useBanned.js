import { useQuery } from 'react-query';
import { api } from 'gdd-components';

export function useBanned() {
  return useQuery('banned', () => {
    return api.banned.getAll().then(res => res.data);
  });
}
