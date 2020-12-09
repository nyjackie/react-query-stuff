import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import ClaimRow from './ClaimRow';
import { useClaims } from 'hooks/useClaims';
import Spinner from 'components/Spinner';
import { getSearchQuery } from 'utils';
import { CLAIM_STATUS } from 'utils/constants';
import BasicPaginator from 'components/BasicPaginator';
import { cn } from 'gdd-components/dist/utils';
import styles from './Claims.module.scss';

const empty = { nonprofits: [] };

function FilterButtons({ status, onClick }) {
  const [statuses, setStatuses] = useState(status.split(','));

  useEffect(() => {
    setStatuses(status.split(','));
  }, [status]);

  function updateStatus(evt) {
    const status = evt.currentTarget.textContent;
    setStatuses(currentState => {
      let newState = [];
      if (currentState.includes(status)) {
        newState = currentState.filter(s => s !== status);
      } else {
        newState = [...currentState, status];
      }
      if (newState.length === 0) {
        // no empty filters allowed, force it back to default filter state
        newState = [CLAIM_STATUS.PENDING, CLAIM_STATUS.SUBMITTED];
      }
      onClick(newState.join(','));
      return newState;
    });
  }

  const buttons = Object.keys(CLAIM_STATUS).map(status => {
    return (
      <button
        type="button"
        key={status}
        onClick={updateStatus}
        className={cn(
          'btn',
          styles[status.toLowerCase()],
          statuses.includes(status) && styles.active
        )}
      >
        {status}
      </button>
    );
  });

  return <div className={styles.filters}>{buttons}</div>;
}

function ClaimsPage({ history, location }) {
  const {
    limit = 20,
    offset = 0,
    status = `${CLAIM_STATUS.PENDING},${CLAIM_STATUS.SUBMITTED}`,
  } = getSearchQuery();

  const { isLoading, isError, data: results = empty, error } = useClaims(
    limit,
    offset,
    status.split(',')
  );

  function updateUrl(o, l, s) {
    const query = { offset: o, limit: l, status: s };
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

        {results?.nonprofits.length > 0 && (
          <FilterButtons
            status={status}
            onClick={s => {
              updateUrl(0, limit, s);
            }}
          />
        )}

        {!results?.nonprofits.length ? (
          <p>No claims in the queue</p>
        ) : (
          results.nonprofits.map(npo => (
            <ul key={npo.id} className="list-unstyled">
              <ClaimRow npo={npo} />
            </ul>
          ))
        )}

        <BasicPaginator
          total={results?.total_results}
          limit={Number(limit)}
          offset={Number(offset)}
          onPageChange={newOffset => {
            updateUrl(newOffset, limit, status);
          }}
          onLimitChange={newLimit => {
            updateUrl(offset, newLimit, status);
          }}
        />
      </Container>
    </div>
  );
}

export default ClaimsPage;
