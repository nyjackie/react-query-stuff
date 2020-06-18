import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

const Claim = ({ claim: { _id, description, user, date } }) => {
  return (
    <div>
      <Moment format="YYYY/MM/DD">{date}</Moment>
      {' | '}
      <Link to={`/claims/${_id}`}>{description}</Link>
      {' | '} {user}
    </div>
  );
};

export default Claim;
