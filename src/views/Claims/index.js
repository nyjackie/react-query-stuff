import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import PageHeader from 'components/PageHeader';
import Claim from './Claim';
import useClaims from 'hooks/useClaims';

const ClaimsPage = () => {
  const { isLoading, isError, data: claims, error } = useClaims();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <Fragment>
      <Container>
        <PageHeader pageTitle="Claims Page" />
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
            {claims.map(claim => (
              <Claim key={claim.id} claim={claim} />
            ))}
          </tbody>
        </Table>
      </Container>
    </Fragment>
  );
};

ClaimsPage.propTypes = {
  getClaims: PropTypes.func.isRequired,
  claims: PropTypes.object.isRequired,
};

export default ClaimsPage;
