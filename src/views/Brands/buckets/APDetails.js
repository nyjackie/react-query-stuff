import React, { useState } from 'react';
import AP from './APIcon';
import { ReactComponent as Arrow } from 'assets/left-arrow.svg';
import APSelect from './APSelect';

const APDetails = ({ offers, setFieldValue }) => {
  const [offerArray, setOfferArray] = useState(offers);
  const reorder = (list, item, change) => {
    const index = list.indexOf(item);
    if (index + change === list.length || index + change < 0) {
      console.log(index, change);
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
  return (
    <div className="mt-2">
      <APSelect offers={offerArray} getFromSelect={getFromSelect} />
      <div className="d-flex overflow-auto">
        {offerArray &&
          offerArray.map((offer, i) => {
            return (
              <div key={offer} className="p-2">
                <AP ap_id={offer} key={offer} />
                <div className="d-flex justify-content-center ">
                  <Arrow className="p-1 pointer" onClick={() => reorder(offerArray, offer, -1)} />
                  <Arrow
                    className="p-1 pointer"
                    transform="scale(-1,1)"
                    onClick={() => reorder(offerArray, offer, 1)}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default APDetails;
