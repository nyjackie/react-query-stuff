import React, { Fragment } from 'react';
import { getSearchQuery } from 'utils';
import { useTransactions } from 'hooks/useTransaction';
import SingleResult from './SingleResult';
import Spinner from 'components/Spinner';
import BasicPaginator from 'components/BasicPaginator';

const SearchResults = ({ location, history }) => {
  const { limit = 20, offset = 0, offer_activation_id, user_id, gd_status } = getSearchQuery(
    location
  );
  const { isLoading, data: results = {} } = useTransactions(
    limit,
    offset,
    offer_activation_id,
    user_id,
    gd_status?.split(',')
  );

  function updateUrl(offer_activation_id, user_id, gd_status, limit, offset) {
    const query = { offer_activation_id, user_id, gd_status, limit: limit, offset: offset };
    let param = new URLSearchParams(query);
    history.push(`${location.pathname}?${param.toString()}`);
  }

  if (isLoading) {
    return (
      <div className="w-100 text-center m-5">
        <Spinner />
      </div>
    );
  }
  if (!results?.affiliate_transactions) {
    return <div className="m-5">Please select search criteria</div>;
  }
  if (results?.affiliate_transactions.length === 0) {
    return (
      <div className="w-100 m-3">
        <figure className="text-center">
          <img src="https://imgflip.com/s/meme/Doge.jpg" alt="empty" width={50} />
          <figcaption>Wow. such empty</figcaption>
        </figure>
      </div>
    );
  }
  return (
    !isLoading &&
    results?.affiliate_transactions && (
      <Fragment>
        <div className="w-100 m-3">
          <BasicPaginator
            total={results?.total_results}
            limit={Number(limit)}
            offset={Number(offset)}
            onPageChange={newOffset => {
              updateUrl(offer_activation_id, user_id, gd_status, limit, newOffset);
            }}
            onLimitChange={newLimit => {
              updateUrl(offer_activation_id, user_id, gd_status, newLimit, offset);
            }}
          />
        </div>
        {results.affiliate_transactions.map((item, i) => (
          <SingleResult item={item} key={i} />
        ))}
      </Fragment>
    )
  );
};

export default SearchResults;
