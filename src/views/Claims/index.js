import React from 'react';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import ClaimRow from './ClaimRow';
import { useClaims } from 'hooks/useClaims';
import Spinner from 'components/Spinner';
import { getSearchQuery } from 'utils';
import BasicPaginator from 'components/BasicPaginator';

const empty = { nonprofits: [] };

function ClaimsPage({ history, location }) {
  const { limit = 20, offset = 0 } = getSearchQuery();
  const { isLoading, isError, data: queue = empty, error } = useClaims(limit, offset);

  function updateUrl(o, l) {
    const query = { offset: o, limit: l };
    const param = new URLSearchParams(query);
    history.push(`${location.pathname}?${param.toString()}`);
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div style={{ paddingBottom: '50px' }}>
      <Helmet>
        <title>Good Deeds | Admin | Nonprofit claims queue</title>
      </Helmet>
      <Container className="block shadow-sm">
        <h2 className="m-0">Nonprofit Claims Queue</h2>
      </Container>
      <Container className="bg-none p-0">
        {isError && <Alert variant={'danger'}>{error.message}</Alert>}

        {!queue?.nonprofits.length ? (
          <p>No claims in the queue</p>
        ) : (
          queue.nonprofits.map(npo => (
            <ul key={npo.id} className="list-unstyled">
              <ClaimRow npo={npo} />
            </ul>
          ))
        )}

        <BasicPaginator
          total={queue?.total_results}
          limit={Number(limit)}
          offset={Number(offset)}
          onSelect={newOffset => {
            updateUrl(newOffset, limit);
          }}
        />
      </Container>
    </div>
  );
}

export default ClaimsPage;
