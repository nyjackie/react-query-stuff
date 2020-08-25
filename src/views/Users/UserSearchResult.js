import React from 'react';
import { Table } from 'react-bootstrap';
import Moment from 'react-moment';
import { useHistory } from 'react-router-dom';

const SingleResult = ({
  result: { id, first_name, last_name, contact_phone, contact_email, created_at },
}) => {
  let history = useHistory();

  function onClick() {
    history.push(`/users/${id}`);
  }

  return (
    <tr className="pointer" onClick={onClick}>
      <td>{first_name}</td>
      <td>{last_name}</td>
      <td>{contact_phone}</td>
      <td>{contact_email}</td>
      <td>
        <Moment format="YYYY/MM/DD">{created_at}</Moment>
      </td>
    </tr>
  );
};

function UserSearchResult({ results }) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Phone#</th>
          <th>Email</th>
          <th>Accounted Created</th>
        </tr>
      </thead>
      <tbody>
        {results.map((item, i) => (
          <SingleResult result={item} key={item.id} />
        ))}
      </tbody>
    </Table>
  );
}

export default UserSearchResult;
