import React, { useState } from 'react';
import AP from './APIcon';
import { ReactComponent as Arrow } from 'assets/left-arrow.svg';
import APSelect from './APSelect';

const APDetails = ({ offers, filter, bucket_id, setFieldValue }) => {
  const [offerArray, setOfferArray] = useState(offers);
  const reorder = (list, item, change) => {
    const index = list.indexOf(item);
    if (index + change === list.length || index + change < 0) {
      return;
    }
    let result = Array.from(list);
    const n1 = result[index];
    const n2 = result[index + change];
    result[index] = n2;
    result[index + change] = n1;
    setOfferArray(result);
    setFieldValue('affiliate_offers', result);
  };

  const getFromSelect = val => {
    setOfferArray(val);
    setFieldValue('affiliate_offers', val);
  };

  const filterChange = e => {
    if (e.target.value === 'null') {
      setFieldValue('manual_mode_filter', null);
    } else {
      setFieldValue('manual_mode_filter', e.target.value);
    }
  };

  return (
    <div className="mt-2">
      <select
        className="mt-2 mb-2 form-control w-auto"
        defaultValue={filter}
        onChange={filterChange}
      >
        <option value="null">Select All</option>
        <option value="COUPON_ONLY">Coupons Only</option>
      </select>
      <APSelect offers={offerArray} getFromSelect={getFromSelect} />
      <div className="d-flex overflow-auto">
        {offerArray &&
          offerArray.map((offer, i) => {
            return (
              <div key={offer} className="p-2">
                <AP ap_id={offer} key={`${bucket_id}-${offer}`} />
                <div className="d-flex justify-content-center ">
                  {i > 0 && (
                    <Arrow className="p-1 pointer" onClick={() => reorder(offerArray, offer, -1)} />
                  )}
                  {i < offerArray.length - 1 && (
                    <Arrow
                      className="p-1 pointer"
                      transform="scale(-1,1)"
                      onClick={() => reorder(offerArray, offer, 1)}
                    />
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default APDetails;
