import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Luxon } from 'gdd-components';

/**
 * This is a component for each row of the Grooming Queue
 */
const GroomingQueueRow = ({ brand }) => {
  const { id, name, created_at } = brand;

  return (
    <tr>
      <td>
        <Luxon format="yyyy/MM/dd">{created_at}</Luxon>
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

GroomingQueueRow.propTypes = {
  brand: PropTypes.object.isRequired,
};

export default GroomingQueueRow;
