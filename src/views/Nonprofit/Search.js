import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import PaceholderLogo from 'assets/no-logo.jpg';

import { getSearchQuery } from 'utils';
import { Paginator } from 'gdd-components';

import { useNonprofitSearch, useGuideStarSearch } from 'hooks/useNonprofits';
import Spinner from 'components/Spinner';
import SearchInput from './NPSearchInput';
import styles from './NonProfitInfo.module.scss';
import { AjaxButton } from 'gdd-components';

function makeLocation(address) {
  if (!address) return '--';
  return [address.city, address.state].filter(Boolean).join(', ');
}

/**
 * Component for a single search result
 * @param {object} param0
 * @param {import('../../utils/typedef').InternalNonProfit} param0.result
 */
const SingleResult = ({ result }) => {
  return (
    <li className={`pointer media row ${styles.result_row}`}>
      <div className="col-md-2">
        <img src={result.logo_url || PaceholderLogo} alt="" />
      </div>
      <div className="media-body col-md">
        <Link to={`/nonprofit/${result.id}`}>
          <h3>{result.name}</h3>
        </Link>
        {result.alias && result.alias !== result.name && (
          <p>
            <b>Alias:</b> {result.alias}
          </p>
        )}
        <p className="mb-3">
          {makeLocation(result.address)} | EIN: {result.ein}
        </p>
        <p>{result.mission}</p>
      </div>
      <div className={`col-md-3 ${styles.result_row_right}`}>
        <p>
          <b>NTEE:</b>
          <br />
          {result.ntee_code}
        </p>
        <p className="m-0">
          <b>Claim status:</b> {result.status?.id === 2 ? 'Claimed' : 'unclaimed'}
        </p>
        <p className="m-0">
          <b>Number of supporters:</b> {result.number_of_supporters}
        </p>
        <p className="m-0">
          <b>Total raised:</b> ${result.lifetime_donations_amount}
        </p>
      </div>
    </li>
  );
};

const GuideStarSearch = () => {
  const { search_term } = getSearchQuery();
  const { isLoading, data: results, refetch } = useGuideStarSearch(search_term);
  const onSearch = () => {
    refetch();
  };
  if (!results) {
    return (
      <div>
        <p>
          We couldn't find any nonprofits. Please try another search term or use our expand search.
        </p>
        <AjaxButton onClick={onSearch} isLoading={isLoading} text="Expand Search" />
      </div>
    );
  }
  if (results?.nonprofits?.length === 0) {
    return <p>no results found</p>;
  }
  return (
    <ul className={styles.results}>
      {results?.nonprofits?.map(item => (
        <SingleResult result={item} key={item.id} />
      ))}
    </ul>
  );
};

const SearchResults = ({ results }) => {
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
    <>
      <Helmet>
        <title>Nonprofit Search | Admin Portal | Give Good Deeds</title>
      </Helmet>
      <Container className="block shadow-sm">
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
          </Col>
        </Row>
        <Row className="mt-4">
          {results?.total_results > 0 && (
            <Col xs={12} lg="auto">
              <Paginator
                total={results?.total_results}
                limit={limit}
                offset={offset}
                onPage={newOffset => {
                  updateUrl(newOffset);
                }}
              />
            </Col>
          )}
          <Col xs={12} lg="auto">
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">Resutls per page</InputGroup.Text>
              </InputGroup.Prepend>
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
            </InputGroup>
          </Col>
        </Row>
      </Container>
      {results && results.nonprofits.length !== 0 && (
        <Container className="block shadow-sm">
          <SearchResults results={results.nonprofits} />
        </Container>
      )}
      {results && results.nonprofits.length === 0 && (
        <Container className="block shadow-sm">
          <GuideStarSearch search_term={search_term} />
        </Container>
      )}
    </>
  );
};

export default NonprofitSearch;
