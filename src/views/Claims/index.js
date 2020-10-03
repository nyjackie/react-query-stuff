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
      {isError && <Alert variant={'danger'}>{error.message}</Alert>}
      <h2>Claims waiting for approval</h2>
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
      {appoved.length > 0 && (
        <>
          <h2>Approved Claims</h2>
          <UpdatedTable claims={appoved} />
        </>
      )}
      {denied.length > 0 && (
        <>
          <h2>Denied Claims</h2>
          <UpdatedTable claims={denied} />
        </>
      )}
    </Container>
  );
}

export default ClaimsPage;
