import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';
import { searchNonprofit } from 'actions/nonprofit';
import { fromQueryString, fixedEncodeURIComponent } from 'utils';
import { KEYCODES } from 'gdd-components/dist/utils';

function queryEncode(str) {
  return fixedEncodeURIComponent(str).replace(/%20/g, '+');
}
function queryDecode(str) {
  try {
    return decodeURIComponent(str.replace(/\+/g, '%20'));
  } catch (err) {
    console.error(err);
    return '';
  }
}

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

const NonprofitSearch = ({ results, searchNonprofit }) => {
  const location = useLocation();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState(null);
  const onChange = e => setSearchTerm(e.target.value);

  const onSubmit = e => {
    e.preventDefault();
    setSearchError(null); // clear error
    if (searchTerm) {
      history.push(`${location.pathname}?query=${queryEncode(searchTerm.trim())}`);
    }
  };

  useEffect(() => {
    if (!location.search) {
      setSearchTerm('');
      return;
    }
    const { query } = fromQueryString(location.search);
    if (query) {
      const decoded = queryDecode(query);
      if (!decoded) {
        setSearchTerm('');
        return;
      }
      setSearchTerm(decoded.trim());
      setSearchError(null); // clear error
      searchNonprofit(decoded).catch(err => {
        setSearchError(err.message);
      });
      return;
    }
    setSearchTerm('');
  }, [location, searchNonprofit]);

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
          {location.search && <SearchResults results={results} />}
        </Col>
      </Row>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  results: state.nonprofits.results,
});

export default connect(mapStateToProps, { searchNonprofit })(NonprofitSearch);
