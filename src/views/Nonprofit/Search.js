import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Table, Form } from 'react-bootstrap';

import { getSearchQuery } from 'utils';
import { KEYCODES } from 'gdd-components/dist/utils';
import { useNonprofitSearch } from 'hooks/useNonprofits';
import Spinner from 'components/Spinner';
import SearchInput from './NPSearchInput';

const SingleResult = ({ result }) => {
  let history = useHistory();

  function handleClick() {
    history.push(`/nonprofit/${result.id}`);
  }

  function handleKeyboardSelect(evt) {
    const key = evt.which || evt.keyCode;
    if (key === KEYCODES.RETURN || key === KEYCODES.SPACE) {
      evt.preventDefault();
      history.push(`/nonprofit/${result.id}`);
    }
  }

  return (
    <tr tabIndex="0" className="pointer" onKeyDown={handleKeyboardSelect} onClick={handleClick}>
      <td>{result.name}</td>
      <td>{result.mission}</td>
    </tr>
  );
};

const SearchResults = ({ results }) => {
  if (!results || results.length === 0) {
    return <p>no results found</p>;
  }

  return (
    <Table borderless hover responsive>
      <thead>
        <tr>
          <th style={{ minWidth: '200px' }}>Name</th>
          <th>Mission</th>
        </tr>
      </thead>
      <tbody>
        {results.map((item, i) => (
          <SingleResult result={item} key={item.id} />
        ))}
      </tbody>
    </Table>
  );
};

const NonprofitSearch = ({ history, location }) => {
  const { search_term, limit = 10, offset = 0 } = getSearchQuery();
  const { isLoading, isError, data: results, error } = useNonprofitSearch({
    search_term,
    limit,
    offset,
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Row>
        <Col>
          <SearchInput
            limit={limit}
            offset={offset}
            label="Search Nonprofits"
            location={location}
            history={history}
          />
          {isError && <p className="mt-2 text-danger">{error.message}</p>}
          {results && <SearchResults results={results.nonprofits} />}
        </Col>
      </Row>
      <Row className="mt-4 justify-content-end">
        <Col sm={6} md={3}>
          <Form.Group>
            <Form.Label>limit:</Form.Label>
            <Form.Control
              as="select"
              defaultValue={limit}
              onChange={e => {
                e.preventDefault();
                const param = new URLSearchParams({ search_term, offset });
                param.set('limit', e.target.value);
                history.push(`${location.pathname}?${param.toString()}`);
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="70">70</option>
              <option value="80">80</option>
              <option value="90">90</option>
              <option value="100">100</option>
            </Form.Control>
          </Form.Group>
        </Col>
        {results?.total_results && results?.total_results > limit && (
          <Col sm={6} md={3}>
            <Form.Group>
              <Form.Label>Page:</Form.Label>
              <Form.Control
                as="select"
                defaultValue={offset}
                onChange={e => {
                  e.preventDefault();
                  const param = new URLSearchParams({ search_term, limit });
                  param.set('offset', e.target.value);
                  history.push(`${location.pathname}?${param.toString()}`);
                }}
              >
                {Array(Math.ceil(results.total_results / limit))
                  .fill(0)
                  .map((_, i) => {
                    return (
                      <option key={'page-select-' + i * limit} value={i * limit}>
                        {i + 1}
                      </option>
                    );
                  })}
              </Form.Control>
            </Form.Group>
          </Col>
        )}
      </Row>
    </Fragment>
  );
};

export default NonprofitSearch;
