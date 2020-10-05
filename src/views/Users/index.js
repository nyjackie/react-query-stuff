import React from 'react';
import { Helmet } from 'react-helmet';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
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
    <>
      <Helmet>
        <title>User Search | Admin Portal | Give Good Deeds</title>
      </Helmet>
      <Container className="block shadow-sm">
        <Row>
          <Col>
            <h2>Search Users</h2>
            <UserSearchInput location={location} history={history} />
            {isError && <p className="mt-2 text-danger">{error.message}</p>}
          </Col>
        </Row>
      </Container>
      {data && (
        <Container className="block shadow-sm">
          <Row>
            <Col>
              <UserSearchResult results={data.users} />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default Users;
