import React from 'react';
import api from 'gdd-api-lib';
import AP from './AP';

const APDetails = ({ offers }) => {
  const loadOptions = async inputValue => {
    const res = await api.searchNonprofits({ search_term: window.btoa(inputValue) });
    const newRes = res.data.nonprofits.map(data => {
      return { value: data.id, label: data.name };
    });
    return newRes;
  };
  return (
    <div>
      <span> Edit Offers +</span>
      <div className="row">
        {offers &&
          offers.map(offer => {
            return <AP ap_id={offer} key={offer} />;
          })}
      </div>
    </div>
  );
};

export default APDetails;
