import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { approveClaim, denyClaim, getClaim } from 'actions/claims';
import { Modal, Button } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';

const ClaimInfo = ({ getClaim, approveClaim, denyClaim, claim: { claim }, match, history }) => {
  const [show, setShow] = useState(false);
  const [choice, decision] = useState('');

  useEffect(() => {
    getClaim(match.params.id);
  }, [getClaim, match.params.id]);

  const openModal = e => {
    decision(e);
    setShow(true);
  };
  const claimChoice = e => {
    console.log('inhere', e);
    setShow(false);
    if (e === 'Approve') {
      approveClaim(claim._id, history);
    } else if (e === 'Deny') {
      denyClaim(claim._id, history);
    }
  };

  const ConfirmationModal = ({ show, choice }) => (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header
        closeButton
        onClick={() => {
          setShow(false);
        }}
      >
        <Modal.Title>Please Confirm</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{choice} this claim.</p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShow(false);
          }}
        >
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            claimChoice(choice);
          }}
        >
          {' '}
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return claim === null ? (
    <div></div>
  ) : (
    <Fragment>
      <PageHeader pageTitle="Claim Info Page" />

      <div>
        <Moment format="YYYY/MM/DD">{claim.date}</Moment>
        {' | '}
        {claim.description}
        {' | '} {claim.user}
      </div>
      <div>
        <Button onClick={() => openModal('Approve')}> Approve</Button>{' '}
        <Button onClick={() => openModal('Deny')} variant="secondary">
          {' '}
          Deny
        </Button>
      </div>
      <ConfirmationModal show={show} choice={choice} />
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
