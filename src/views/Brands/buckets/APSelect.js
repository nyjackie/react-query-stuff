import React, { useEffect, useState, useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import styles from './Buckets.module.scss';
import errorHandler from 'utils/errorHandler';
import { searchOffers, getOfferByGuid } from 'gdd-api-lib';

const dot = () => ({
  alignItems: 'center',
  display: 'flex',
  ':before': {
    content: '"c"',
    margin: 'auto',
    color: '#FF8C00',
    height: 26,
  },
});

const colourStyles = {
  multiValue: (styles, { data }) => {
    const res = {
      ...styles,
      backgroundColor: !!data.coupon_list ? '#FFFF66' : '#ccc',
    };
    if (!!data.coupon_list) {
      return { ...res, ...dot() };
    } else {
      return res;
    }
  },
};

const loadOptions = async inputValue => {
  try {
    const res = await searchOffers({ search_term: window.btoa(inputValue) });
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
    return await getOfferByGuid({ offer_guid: id, offer_type: 'AFFILIATE_PROGRAM' }).then(res => {
      return {
        value: res.data?.offer_guid || null,
        label: res.data?.offer_details?.brand_name || null,
        coupon_list: !!res.data?.offer_details?.coupon_list?.length || false,
      };
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
        styles={colourStyles}
      />
    </div>
  );
};

export default APSelect;
