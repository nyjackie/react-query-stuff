import React, { Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';
import { queryEncode, getSearchQuery } from 'utils';
import { KEYCODES } from 'gdd-components/dist/utils';
import { useNonprofitSearch } from 'hooks/useNonprofits';
import Spinner from 'components/Spinner';

const SingleResult = ({ result }) => {
  let history = useHistory();

  function handleClick() {
    history.push(`/nonprofit/${result.ein}`);
  }

  function handleKeyboardSelect(evt) {
    const key = evt.which || evt.keyCode;
    if (key === KEYCODES.RETURN || key === KEYCODES.SPACE) {
      evt.preventDefault();
      history.push(`/nonprofit/${result.ein}`);
    }
  }

  return (
    <tr tabIndex="0" className="pointer" onKeyDown={handleKeyboardSelect} onClick={handleClick}>
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

const NonprofitSearch = ({ history, location }) => {
  const query = getSearchQuery(location);
  const [searchTerm, setSearchTerm] = useState(query);
  const onChange = e => setSearchTerm(e.target.value);
  const { isLoading, isError, data: results, error } = useNonprofitSearch(query);

  const onSubmit = e => {
    e.preventDefault();
    if (searchTerm) {
      history.push(`${location.pathname}?query=${queryEncode(searchTerm.trim())}`);
    }
  };

  if (isLoading) {
    return <Spinner fullPage={true} />;
  }

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
            {isError && <p className="mt-2 text-danger">{error.message}</p>}
          </Form>
          {location.search && <SearchResults results={results} />}
        </Col>
      </Row>
    </Fragment>
  );
};

export default NonprofitSearch;
