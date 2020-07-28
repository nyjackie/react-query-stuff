import React from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import PageHeader from 'components/PageHeader';
import Claim from './Claim';
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
        </tr>
      </thead>
      <tbody>
        {claims.map(claim => (
          <Claim key={claim.id} claim={claim} note={claim.note} />
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
    <Container>
      <PageHeader pageTitle="Claims Page" />
      {isError && <Alert variant={'danger'}>{error.message}</Alert>}
      <h2>Waiting for approval</h2>
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
            <Claim key={claim.id} claim={claim} />
          ))}
        </tbody>
      </Table>
      {appoved.length > 0 && (
        <>
          <h2>Approved</h2>
          <UpdatedTable claims={appoved} />
        </>
      )}
      {denied.length > 0 && (
        <>
          <h2>Denied</h2>
          <UpdatedTable claims={denied} />
        </>
      )}
    </Container>
  );
}

export default ClaimsPage;
