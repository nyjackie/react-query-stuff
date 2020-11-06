import React, { useEffect, useState, useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import api from 'gdd-api-lib';
import styles from './Buckets.module.scss';
import errorHandler from 'utils/errorHandler';

const loadOptions = async inputValue => {
  try {
    const res = await api.searchOffers({ search_term: window.btoa(inputValue) });
    const newRes = res.data.offers.map(data => {
      return { value: data.offer_guid, label: data.offer_details.brand_name };
    });
    return newRes;
  } catch (err) {
    errorHandler(err);
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
    errorHandler(err);
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
    <div className=" position-relative">
      {loading && (
        <div className={styles.spinner}>
          <Spinner className="ml-2" animation="border" />
        </div>
      )}
      <AsyncSelect
        cacheOptions
        value={defaultOffers}
        isMulti
        isSearchable={true}
        onChange={onChange}
        loadOptions={loadOptions}
      />
    </div>
  );
};

export default APSelect;
