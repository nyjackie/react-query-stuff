import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Form } from 'react-bootstrap';

import { getSearchQuery } from 'utils';
import { Paginator } from 'gdd-components';

import { useNonprofitSearch } from 'hooks/useNonprofits';
import Spinner from 'components/Spinner';
import SearchInput from './NPSearchInput';
import styles from './NonProfitInfo.module.scss';

const SingleResult = ({ result }) => {
  return (
    <li className="pointer">
      <Link to={`/nonprofit/${result.id}`}>
        <h3>{result.name}</h3>
      </Link>
      <p>{result.mission}</p>
    </li>
  );
};

const SearchResults = ({ results }) => {
  if (!results || results.length === 0) {
    return <p>no results found</p>;
  }

  return (
    <ul className={styles.results}>
      {results.map(item => (
        <SingleResult result={item} key={item.id} />
      ))}
    </ul>
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

  function updateUrl(o = offset, l = limit) {
    const query = { offset: o, limit: l };
    if (search_term) {
      query.search_term = search_term;
    }
    const param = new URLSearchParams(query);

    history.push(`${location.pathname}?${param.toString()}`);
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
      <Row className="mt-4 justify-content-between">
        <Col xs={12} lg="auto">
          {results?.total_results && (
            <Paginator
              total={results?.total_results}
              limit={limit}
              offset={offset}
              onPage={newOffset => {
                updateUrl(newOffset);
              }}
            />
          )}
        </Col>
        <Col xs={12} lg="auto">
          <Form.Group as={Row} controlId="perPage">
            <Form.Label as={Col} xs={12} lg="auto" className="text-right">
              Resutls per page:
            </Form.Label>
            <Col xs={12} lg="auto">
              <Form.Control
                as="select"
                defaultValue={limit}
                onChange={e => {
                  e.preventDefault();
                  updateUrl(offset, e.target.value);
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
            </Col>
          </Form.Group>
        </Col>
      </Row>
    </Fragment>
  );
};

export default NonprofitSearch;
