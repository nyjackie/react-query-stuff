import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Luxon } from 'gdd-components';
import styles from './Claim.module.scss';

const Claim = ({ claim, note }) => {
  const { id, created_at, first_name, last_name, email, phone, nonprofit } = claim;

  return (
    <tr>
      <td>
        <Luxon format="yyyy/MM/dd">{created_at}</Luxon>
      </td>
      <td>
        <Link to={`/nonprofit/${nonprofit.id}`}>{nonprofit.name}</Link>
      </td>
      <td>
        {first_name} {last_name}
      </td>
      <td>{email}</td>
      <td>{phone}</td>
      {note && (
        <td>
          <span className={styles.truncate}>{note}</span>
        </td>
      )}
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
