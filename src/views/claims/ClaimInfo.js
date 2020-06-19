import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { getClaim } from '../../actions/claims';
import { Button } from 'react-bootstrap';

const ClaimInfo = ({ getClaim, claim: { claim }, match, history }) => {
  console.log(claim);
  useEffect(() => {
    getClaim(match.params.id);
  }, [getClaim, match.params.id]);

  const popUp = () => {
    if (window.confirm('Are you sure?')) {
      /// Dispatch DELETE/APPROVE event here?

      history.push('/claims');
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
        <Button onClick={() => popUp()}>Approve</Button>{' '}
        <Button onClick={() => popUp()}> Deny</Button>
      </div>
    </Fragment>
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
