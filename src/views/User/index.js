import React, { Fragment, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';
import UserSearchResult from './UserSearchResult';
import { useSearchUsers } from 'hooks/useUsers';
import { queryEncode, getSearchQuery } from 'utils';
import Spinner from 'components/Spinner';

function Users({ history, location }) {
  const query = getSearchQuery(location);
  const [searchTerm, setSearchTerm] = useState(query);
  const onChange = e => setSearchTerm(e.target.value);
  const { isLoading, isError, data, error } = useSearchUsers(query);

  const onSubmit = e => {
    e.preventDefault();
    if (searchTerm) {
      history.push(`${location.pathname}?query=${queryEncode(searchTerm.trim())}`);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <PageHeader pageTitle="Search by User" />
      <Row>
        <Col>
          <Form onSubmit={onSubmit}>
            <Form.Group controlId="search">
              <Form.Control
                type="text"
                name="searchTerm"
                onChange={e => onChange(e)}
                value={searchTerm}
                required
              />
            </Form.Group>
            <Button type="submit" value="Search">
              Search
            </Button>
            {isError && <p className="mt-2 text-danger">{error.message}</p>}
          </Form>
          <UserSearchResult results={data} />
        </Col>
      </Row>
    </Fragment>
  );
}

export default Users;
