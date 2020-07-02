import React, { Fragment, useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageHeader from 'components/PageHeader';
import { getUsers } from 'actions/user';
import UserSearchResult from './UserSearchResult';

const Users = ({ type, results, getUsers }) => {
  const [formData, setFormData] = useState({
    searchTerm: '',
  });
  const [searchError, setSearchError] = useState(null);
  const { searchTerm } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    setSearchError(null); // clear error
    getUsers(searchTerm).catch(err => {
      setSearchError(err.message);
    });
  };

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
            {searchError && <p className="mt-2 text-danger">{searchError}</p>}
          </Form>
          <UserSearchResult />
        </Col>
      </Row>
    </Fragment>
  );
};


const mapStateToProps = state => ({
  results: state.nonprofits.results,
});


export default connect(mapStateToProps, { getUsers })(Users);
