import React from 'react';
import { Link } from 'react-router-dom';
import { USER_TYPES } from 'utils/constants';
import styles from './User.module.scss';

const SingleResult = ({
  result: { user_id, first_name, last_name, phone_number, email, user_type },
}) => {
  return (
    <li>
      <p>
        <b>user id:</b>
      </p>
      <p>{user_id}</p>
      <p>
        <b>first name:</b>
      </p>
      <p>{first_name}</p>
      <p>
        <b>last name:</b>
      </p>
      <p>{last_name}</p>
      <p>
        <b>phone:</b>
      </p>
      <p>{phone_number}</p>
      <p>
        <b>email:</b>
      </p>
      <p>{email}</p>
      <p>
        <b>user type:</b>
      </p>
      <p>
        <span className={`${styles.label} ${styles[user_type]}`}>{user_type}</span>
      </p>
      <p>
        <b>Profile:</b>
      </p>
      <p>
        <Link to={`/users/${user_type}/${user_id}`}>{`/users/${user_type}/${user_id}`}</Link>
      </p>
    </li>
  );
};

function UserSearchResult({ results }) {
  if (!results || results.length === 0) {
    return <p className="mt-2 text-success">No users found</p>;
  }

  return (
    <ul className={styles.userSearchResult}>
      {results.map((item, i) => (
        <SingleResult result={item} key={item.user_id} />
      ))}
    </ul>
  );
}

export default UserSearchResult;
