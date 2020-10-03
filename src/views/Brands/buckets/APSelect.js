import React, { useEffect, useState, useCallback } from 'react';
import { Button, Accordion } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import api from 'gdd-api-lib';

const loadOptions = async inputValue => {
  try {
    const res = await api.searchOffers({ search_term: window.btoa(inputValue) });
    const newRes = res.data.offers.map(data => {
      return { value: data.offer_guid, label: data.offer_details.brand_name };
    });
    return newRes;
  } catch (err) {
    console.log(err);
    return {};
  }
};

const getData = async id => {
  try {
    return await api
      .getOfferByGuid({ offer_guid: id, offer_type: 'AFFILIATE_PROGRAM' })
      .then(res => {
        return { value: res.data.offer_guid, label: res.data.offer_details.brand_name };
      });
  } catch (err) {
    console.log(err);
    return {};
  }
};

const APSelect = ({ offers, getFromSelect }) => {
  const [newOffers] = useState(offers);
  const [defaultOffers, setDefaultoffers] = useState([]);
  useEffect(() => {
    if (newOffers) {
      let arr = newOffers.map(offer => offer);
      arr.forEach(async offer => {
        let data = await getData(offer);
        setDefaultoffers(offer => [...offer, data]);
      });
    }
  }, [newOffers]);

  const onChange = useCallback(
    e => {
      const val = e.map(el => el['value']);
      getFromSelect(val);
    },
    [getFromSelect]
  );

  return (
    defaultOffers.length === newOffers.length && (
      <Accordion>
        <Accordion.Toggle as={Button} variant="success" eventKey="0">
          Edit Offers +
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0" className="mt-2 mb-2">
          <AsyncSelect
            cacheOptions
            defaultValue={defaultOffers}
            isMulti
            isSearchable={true}
            onChange={onChange}
            loadOptions={loadOptions}
          />
        </Accordion.Collapse>
      </Accordion>
    )
  );
};

export default APSelect;
