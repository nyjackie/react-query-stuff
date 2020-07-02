import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';
import { searchNonprofit } from 'actions/nonprofit';

const SingleResult = ({ result }) => {
  let history = useHistory();

  function handleClick() {
    history.push(`/nonprofit/${result.ein}`);
  }

  return (
    <tr className="pointer" onClick={handleClick}>
      <td>{result.name}</td>
      <td>{result.ein}</td>
      <td>{result.mission}</td>
    </tr>
  );
};

const SearchResults = ({ results }) => {
  if (!results || results.length === 0) {
    return null;
  }
  return (
    <Table borderless hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>EIN</th>
          <th>Mission</th>
        </tr>
      </thead>
      <tbody>
        {results.map((item, i) => (
          <SingleResult result={item} key={item.ein} />
        ))}
      </tbody>
    </Table>
  );
};

const SearchPage = ({ results, searchNonprofit }) => {
  const [formData, setFormData] = useState({
    searchTerm: '',
  });
  const [searchError, setSearchError] = useState(null);
  const { searchTerm } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    setSearchError(null); // clear error
    searchNonprofit(searchTerm).catch(err => {
      setSearchError(err.message);
    });
  };

  return (
    <Fragment>
      <PageHeader pageTitle="Search Nonprofits" />
      <Row>
        <Col>
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
          <SearchResults results={results} />
        </Col>
      </Row>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  results: state.nonprofits.results,
});

export default connect(mapStateToProps, { searchNonprofit })(SearchPage);
