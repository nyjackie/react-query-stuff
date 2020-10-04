import React, { useEffect, useState, useCallback } from 'react';
import { Button, Accordion, Spinner } from 'react-bootstrap';
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
  const [defaultOffers, setDefaultoffers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchData() {
      if (offers) {
        setLoading(true);
        const newData = [];
        for (let offer of offers) {
          const data = await getData(offer);
          newData.push(data);
        }
        setDefaultoffers(newData);
        setLoading(false);
      }
    }
    fetchData();
  }, [offers]);

  const onChange = useCallback(
    e => {
      const val = e.map(el => el['value']);
      getFromSelect(val);
    },
    [getFromSelect]
  );

  return (
    <Accordion>
      <div className="d-flex">
        <Accordion.Toggle as={Button} variant="success" eventKey="0">
          Edit Offers +
        </Accordion.Toggle>
        {loading && <Spinner className="ml-2" animation="border" />}
      </div>

      <Accordion.Collapse eventKey="0" className="mt-2 mb-2">
        <AsyncSelect
          cacheOptions
          value={defaultOffers}
          isMulti
          isSearchable={true}
          onChange={onChange}
          loadOptions={loadOptions}
        />
      </Accordion.Collapse>
    </Accordion>
  );
};

export default APSelect;
