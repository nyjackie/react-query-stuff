import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { approveClaim, denyClaim, getClaim } from 'actions/claims';
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap';
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

  const ConfirmationModal = ({ show, choice }) => {
    const [msg, setMsg] = useState({
      note: '',
    });
    const onChange = e => setMsg({ ...msg, note: e.target.value });

    const claimChoice = e => {
      setShow(false);
      if (e === 'approve') {
        approveClaim(claim._id, history, msg);
      } else if (e === 'deny') {
        denyClaim(claim._id, history, msg);
      }
    };
    return (
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
          <p>You are about to {choice} this claim.</p>
          <br />
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Leave a comment</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              as="textarea"
              aria-label="Leave Comments"
              value={msg.note}
              onChange={onChange}
            />
          </InputGroup>
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
  };

  return claim === null ? (
    <div></div>
  ) : (
    <Fragment>
      <PageHeader pageTitle="Claim Info Page" />

      <div>
        <p>
          <Moment format="YYYY/MM/DD">{claim.date}</Moment>
        </p>
        <p>{claim.name}</p>
        <p>{claim.description}</p>
        <p>{claim.contact_email}</p>
      </div>
      <div>
        <Button onClick={() => openModal('approve')}> Approve</Button>{' '}
        <Button onClick={() => openModal('deny')} variant="secondary">
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
