import { useQuery } from 'react-query';
import { getConsumerProfileOptions } from 'gdd-api-lib/dist/api-lib';

export function usePronounIncomeOptions() {
  return useQuery(
    'pronouns',
    () => {
      return getConsumerProfileOptions().then(res => res.data);
    },
    {
      // these should never go stale because they will barely ever change. We
      // should definitely cache them throughout the whole session
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
}
