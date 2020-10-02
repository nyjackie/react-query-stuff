import React from 'react';
import { useOffer } from 'hooks/useOffers';

const APIcon = ({ ap_id }) => {
  const { isLoading, isError, data = {} } = useOffer(ap_id);
  return (
    !isLoading &&
    !isError &&
    data && (
      <div className="col-sm-auto p-1">
        <img width={70} src={data.offer_details.logo_url} alt="" />
      </div>
    )
  );
};

export default APIcon;
