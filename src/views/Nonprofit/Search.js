import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Table } from 'react-bootstrap';

import { getSearchQuery } from 'utils';
import { KEYCODES } from 'gdd-components/dist/utils';
import { useNonprofitSearch } from 'hooks/useNonprofits';
import Spinner from 'components/Spinner';
import SearchInput from 'components/SearchInput';

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
  const query = getSearchQuery('query');
  const { isLoading, isError, data: results, error } = useNonprofitSearch(query);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Row>
        <Col>
          <SearchInput label="Search Nonprofits" location={location} history={history} />
          {isError && <p className="mt-2 text-danger">{error.message}</p>}
          {location.search && <SearchResults results={results} />}
        </Col>
      </Row>
    </Fragment>
  );
};

export default NonprofitSearch;
