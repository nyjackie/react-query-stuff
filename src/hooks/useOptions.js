import { useQuery } from 'react-query';
import api from 'gdd-api-lib';

export function usePronounIncomeOptions() {
  return useQuery(
    'pronouns',
    () => {
      return api.getConsumerProfileOptions().then(res => res.data);
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
}
