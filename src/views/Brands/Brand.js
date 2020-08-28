import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const Brand = ({ brand }) => {
  const { id, name, created_at } = brand;

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
