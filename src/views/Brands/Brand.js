import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import styles from './Brands.module.scss';

const Brand = ({ brand }) => {
  const {
    id,
    brand_category_id,
    master_merchant_id,
    logo_url,
    hero_url,
    name,
    created_at,
    modified_at,
    is_disabled,
    is_groomed,
  } = brand;

  return (
    <tr>
      <td>
        <Moment format="YYYY/MM/DD">{created_at}</Moment>
      </td>
      <td>{name}</td>
      <td>
        <Link to={`/brands/${id}`} className="btn btn-primary">
          View Brand
        </Link>
      </td>
    </tr>
  );
};

export default Brand;

Brand.propTypes = {
  brand: PropTypes.object.isRequired,
};
