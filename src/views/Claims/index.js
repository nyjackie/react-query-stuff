import React, { Fragment, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageHeader from 'components/PageHeader';
import Claim from './Claim';
import { getClaims } from '../../actions/claims';
import { Table } from 'react-bootstrap';

const ClaimsPage = ({ getClaims, claims: { claims } }) => {
  useEffect(() => {
    getClaims();
  }, [getClaims]);

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

const mapStateToProps = state => ({
  claims: state.claims,
});

export default connect(mapStateToProps, { getClaims })(ClaimsPage);
