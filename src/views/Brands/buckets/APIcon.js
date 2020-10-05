import React from 'react';
import { useOffer } from 'hooks/useOffers';

const APIcon = ({ ap_id }) => {
  const { isLoading, isError, data = {} } = useOffer(ap_id);
  return (
    !isLoading &&
    !isError &&
    data && (
      <div className="col-sm-auto p-3 text-center border">
        <img width={120} src={data.offer_details.logo_url} alt="" />
        <div>
          <span>
            <b>{data.offer_details.brand_name}</b>
          </span>
          <br />
          <span className="text-info">
            {data.offer_details.commission_type === 'PERCENT'
              ? Math.round(data.offer_details.commission * 10000) / 100 + '%'
              : '$' + Math.round(data.offer_details.commission * 100) / 100}
          </span>
        </div>
      </div>
    )
  );
};

export default APIcon;
