import React from 'react';
import { getSearchQuery } from 'utils';
import { useTransactions } from 'hooks/useTransaction';
import SingleResult from './SingleResult';
const SearchResults = ({ location }) => {
  const { limit = 20, offset = 0, offer_activation_id, user_id, gd_status } = getSearchQuery(
    location
  );
  const { isLoading, isError, data: results = {}, error } = useTransactions(
    limit,
    offset,
    offer_activation_id,
    user_id,
    gd_status?.split(',')
  );
  if (!results?.affiliate_transactions) {
    return <div>Please select search criteria</div>;
  }
  return (
    !isLoading &&
    results?.affiliate_transactions && (
      <div>
        {results.affiliate_transactions.map((item, i) => (
          <SingleResult item={item} key={i} />
        ))}
      </div>
    )
  );
};

export default SearchResults;
