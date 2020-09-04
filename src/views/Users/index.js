import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import UserSearchResult from './UserSearchResult';
import { useSearchUsers } from 'hooks/useUsers';
import { getSearchQuery } from 'utils';
import Spinner from 'components/Spinner';
import UserSearchInput from './UserSearchInput';

function Users({ history, location }) {
  const query = getSearchQuery();
  const { isLoading, isError, data, error } = useSearchUsers(query);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Row>
        <Col>
          <h2>Search Users</h2>
          <UserSearchInput location={location} history={history} />
          {isError && <p className="mt-2 text-danger">{error.message}</p>}
          {data && <UserSearchResult results={data.users} />}
        </Col>
      </Row>
    </Fragment>
  );
}

export default Users;
