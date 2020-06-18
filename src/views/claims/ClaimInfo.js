import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { getClaim } from '../../actions/claims';

const ClaimInfo = ({ getClaim, claim: { claim }, match }) => {
  console.log(claim);
  useEffect(() => {
    getClaim(match.params.id);
  }, [getClaim, match.params.id]);
  return claim === null ? (
    <div></div>
  ) : (
    <div>
      <Moment format="YYYY/MM/DD">{claim.date}</Moment>
      {' | '}
      {claim.description}
      {' | '} {claim.user}
    </div>
  );
};

ClaimInfo.propTypes = {
  getClaim: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  claim: state.claims,
});

export default connect(mapStateToProps, { getClaim })(ClaimInfo);
