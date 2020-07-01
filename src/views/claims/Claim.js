import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

const Claim = ({ claim: { ein, name, description, mission, contact_email, date } }) => {
  return (
    <Fragment>
      <tr key={ein}>
        <td>{name}</td>
        <td>
          <Link to={`/claims/${ein}`}>{mission}</Link>
        </td>
        <td>{contact_email}</td>
        <td>
          <Moment format="YYYY/MM/DD">{date}</Moment>
        </td>
      </tr>
    </Fragment>
  );
};

export default Claim;
