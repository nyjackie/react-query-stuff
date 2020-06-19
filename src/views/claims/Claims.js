import React, { Fragment, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageHeader from 'components/PageHeader';
import Claim from './Claim';
import { getClaims } from '../../actions/claims';

const ClaimsPage = ({ getClaims, claims: { claims } }) => {
  useEffect(() => {
    getClaims();
  }, [getClaims]);

  return (
    <Fragment>
      <PageHeader pageTitle="Claims Page" />
      <Container>
        {claims.map(claim => (
          <Claim key={claim._id} claim={claim} />
        ))}
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
