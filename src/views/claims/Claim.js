import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

const Claim = ({ claim: { _id, company, description, user, date } }) => {
  return (
    <Fragment>
      <tr key={_id}>
        <td>{company}</td>
        <td>
          <Link to={`/claims/${_id}`}>{description}</Link>
        </td>
        <td>{user}</td>
        <td>
          <Moment format="YYYY/MM/DD">{date}</Moment>
        </td>
      </tr>
    </Fragment>
  );
};

export default Claim;
