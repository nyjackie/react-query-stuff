import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import UserSearchResult from './UserSearchResult';
import { useSearchUsers } from 'hooks/useUsers';
import { getSearchQuery } from 'utils';
import Spinner from 'components/Spinner';
import SearchInput from 'components/SearchInput';

function Users({ history, location }) {
  const query = getSearchQuery('query');
  const { isLoading, isError, data, error } = useSearchUsers(query);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Row>
        <Col>
          <SearchInput label="Search Users" location={location} history={history} />
          {isError && <p className="mt-2 text-danger">{error.message}</p>}
          <UserSearchResult results={data} />
        </Col>
      </Row>
    </Fragment>
  );
}

export default Users;
