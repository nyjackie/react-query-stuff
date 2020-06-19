import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { approveClaim, denyClaim, getClaim } from 'actions/claims';
import { Button } from 'react-bootstrap';

const ClaimInfo = ({ getClaim, approveClaim, denyClaim, claim: { claim }, match, history }) => {
  useEffect(() => {
    getClaim(match.params.id);
  }, [getClaim, match.params.id]);

  const popUp = e => {
    if (e === 1) {
      if (window.confirm('Confirm Approval')) {
        approveClaim(claim._id);
      }
    }
  };

  return claim === null ? (
    <div></div>
  ) : (
    <Fragment>
      <div>
        <Moment format="YYYY/MM/DD">{claim.date}</Moment>
        {' | '}
        {claim.description}
        {' | '} {claim.user}
      </div>
      <div>
        <Button onClick={() => popUp(1)}>Approve</Button>{' '}
        <Button onClick={() => popUp(2)}> Deny</Button>
      </div>
    </Fragment>
  );
};

ClaimInfo.propTypes = {
  getClaim: PropTypes.func.isRequired,
  approveClaim: PropTypes.func.isRequired,
  denyClaim: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  claim: state.claims,
});

export default connect(mapStateToProps, { getClaim, approveClaim, denyClaim })(ClaimInfo);
