import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import PageHeader from 'components/PageHeader';
import Claim from './Claim';
import { useClaims } from 'hooks/useClaims';
import Spinner from 'components/Spinner';

const ClaimsPage = () => {
  const { isLoading, isError, data: claims, error } = useClaims();

  if (isLoading) {
    return <Spinner fullPage={true} />;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const appoved = claims.filter(c => c.status === 'approved');
  const denied = claims.filter(c => c.status === 'denied');
  const waiting = claims.filter(c => c.status === 'waiting');

  return (
    <Container>
      <PageHeader pageTitle="Claims Page" />
      <h2>Waiting for approval</h2>
      <Table striped bordered hover>
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
          <Table striped bordered hover>
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
              {appoved.map(claim => (
                <Claim key={claim.id} claim={claim} note={claim.note} />
              ))}
            </tbody>
          </Table>
        </>
      )}
      {denied.length > 0 && (
        <>
          <h2>Denied</h2>
          <Table striped bordered hover>
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
              {denied.map(claim => (
                <Claim key={claim.id} claim={claim} note={claim.note} />
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

ClaimsPage.propTypes = {
  getClaims: PropTypes.func.isRequired,
  claims: PropTypes.object.isRequired,
};

export default ClaimsPage;
