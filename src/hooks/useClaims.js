import { useQuery } from 'react-query';
import { api } from 'gdd-components';

export default function useClaims() {
  return useQuery('claims', () => {
    return api.claims.getAll().then(res => res.data.data);
  });
}
