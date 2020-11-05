import React from 'react';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import ClaimRow from './ClaimRow';
import { useClaims } from 'hooks/useClaims';
import Spinner from 'components/Spinner';

function UpdatedTable({ claims }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Date</th>
          <th>Nonprofit</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Note</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {claims.map(claim => (
          <ClaimRow key={claim.id} claim={claim} note={claim.note || '[none provided]'} />
        ))}
      </tbody>
    </Table>
  );
}

function ClaimsPage() {
  const { isLoading, isError, data: claims = [], error } = useClaims();

  if (isLoading) {
    return <Spinner />;
  }

  const appoved = claims.filter(c => c.status === 'approved');
  const denied = claims.filter(c => c.status === 'denied');
  const waiting = claims.filter(c => c.status === 'waiting');

  return (
    <Container className="block shadow-sm">
      <Helmet>
        <title>Claim Queue | Admin Portal | Give Good Deeds</title>
      </Helmet>
      <h2>Nonprofit Claims Queue</h2>
      {waiting.length === 0 && <p>No Claims in the queue</p>}
      {isError && <Alert variant={'danger'}>{error.message}</Alert>}
      {waiting.length > 0 && (
        <>
          <h3>Claims waiting for approval</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Nonprofit</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {waiting.map(claim => (
                <ClaimRow key={claim.id} claim={claim} />
              ))}
            </tbody>
          </Table>
        </>
      )}
      {appoved.length > 0 && (
        <>
          <h3>Approved Claims</h3>
          <UpdatedTable claims={appoved} />
        </>
      )}
      {denied.length > 0 && (
        <>
          <h3>Denied Claims</h3>
          <UpdatedTable claims={denied} />
        </>
      )}
    </Container>
  );
}

export default ClaimsPage;
