import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SingleResult = ({
  result: {
    user_id,
    first_name,
    last_name,
    phone_number,
    email,
    // created_at,
    // modified_at,
    user_type,
  },
}) => {
  return (
    <tr className="pointer">
      <td>{first_name}</td>
      <td>{last_name}</td>
      <td>{phone_number}</td>
      <td>{email}</td>
      <td>{user_type}</td>
      <td>
        <Link className="btn btn-primary" to={`/users/${user_type}/${user_id}`}>
          View
        </Link>
      </td>
    </tr>
  );
};

function UserSearchResult({ results }) {
  if (!results || results.length === 0) {
    return <p className="mt-2 text-success">No users found</p>;
  }

  return (
    <Table striped bordered hover className="mt-4">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Phone#</th>
          <th>Email</th>
          <th>User type</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {results.map((item, i) => (
          <SingleResult result={item} key={item.user_id} />
        ))}
      </tbody>
    </Table>
  );
}

export default UserSearchResult;
