import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const Claim = ({ claim }) => {
  const { id, created_at, first_name, last_name, email, phone, nonprofit } = claim;

  return (
    <tr>
      <td>
        <Moment format="YYYY/MM/DD">{created_at}</Moment>
      </td>
      <td>
        <Link to={`/nonprofit/${nonprofit.ein}`}>{nonprofit.name}</Link>
      </td>
      <td>
        {first_name} {last_name}
      </td>
      <td>{email}</td>
      <td>{phone}</td>
      <td>
        <Link to={`/claims/${id}`} className="btn btn-primary">
          view claim
        </Link>
      </td>
    </tr>
  );
};

export default Claim;

Claim.propTypes = {
  claim: PropTypes.object.isRequired,
};
