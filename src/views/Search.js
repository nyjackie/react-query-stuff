import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { Form, Button, Row, Col } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';

const SearchPage = props => {
  const [formData, setFormData] = useState({
    searchTerm: '',
  });
  const [searchError, setSearchError] = useState(null);
  const { searchTerm } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    setSearchError(null); // clear error
    // login(email, password).catch(err => {
    //   // console.error(err)
    //   setSearchError(err.message);
    // });
  };

  return (
    <Fragment>
      <PageHeader pageTitle="Search Nonprofits" />
      <Row>
        <Col md={6}>
          <Form onSubmit={onSubmit}>
            <Form.Group controlId="searchNP">
              <Form.Label>
                <b>Search Nonprofits</b>
              </Form.Label>
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
        </Col>
      </Row>
    </Fragment>
  );
};

// SearchPage.propTypes = {
//   login: PropTypes.func.isRequired,
//   isAuthenticated: PropTypes.bool,
// };

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(SearchPage);
