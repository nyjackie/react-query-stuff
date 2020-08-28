import { useQuery } from 'react-query';
import api from 'gdd-api-lib';

export function useBanned() {
  return useQuery('banned', () => {
    return api.getBanned().then(res => res.data);
  });
}
