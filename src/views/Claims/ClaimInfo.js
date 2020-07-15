import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { approveClaim, denyClaim, getClaim } from 'actions/claims';
import { addNotification } from 'actions/notifications';
import {
  Modal,
  Button,
  InputGroup,
  FormControl,
  Col,
  Row,
  Container,
  Jumbotron,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ConfirmationModal = ({ show, choice, onClose, onApprove, onDeny }) => {
  const [msg, setMsg] = useState({
    note: '',
  });
  const onChange = e => setMsg({ ...msg, note: e.target.value });

  const claimChoice = e => {
    onClose();
    if (e === 'approve') {
      onApprove(msg);
    } else if (e === 'deny') {
      onDeny(msg);
    }
  };
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton onClick={onClose}>
        <Modal.Title>Please Confirm</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          You are about to <strong>{choice}</strong> this claim.
        </p>
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
        <Button variant="light" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            claimChoice(choice);
          }}
        >
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ClaimInfo = ({
  addNotification,
  getClaim,
  approveClaim,
  denyClaim,
  claim: { claim },
  match,
  history,
}) => {
  const [show, setShow] = useState(false);
  const [choice, decision] = useState('');

  useEffect(() => {
    getClaim(match.params.id);
  }, [getClaim, match.params.id]);

  const openModal = e => {
    decision(e);
    setShow(true);
  };

  return claim === null ? (
    <div></div>
  ) : (
    <Fragment>
      <Jumbotron>
        <Container>
          <Row>
            <Col>
              <h2>Claim</h2>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <p>
                <Moment format="MM/DD/YYYY h:MM a">{claim.created_at}</Moment>
              </p>
            </Col>
          </Row>

          <Row>
            <Col>
              <h3>Contact info</h3>
              <p>
                <b>name: </b> {claim.first_name} {claim.last_name}
              </p>
              <p>
                <b>Email: </b> <a href={`mailto:${claim.email}`}>{claim.email}</a>
              </p>
              <p>
                <b>Phone: </b> <a href={`tel:${claim.phone}`}>{claim.phone}</a>
              </p>
            </Col>
            <Col>
              <h3>Nonprofit info</h3>
              <p>
                <b>Name:&nbsp;</b>
                {claim.nonprofit.name}
              </p>
              <p>
                <b>EIN:&nbsp;</b>
                {claim.nonprofit.ein}
              </p>
              <p>
                GDD profile: <Link to={`/nonprofit/${claim.nonprofit.ein}`}>link</Link>
              </p>
              <p>
                <b>GuideStar profile:&nbsp;</b>
                <a
                  href={`https://www.guidestar.org/profile/${claim.nonprofit.ein}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  link
                </a>
              </p>
              <p>
                <b>Address: </b>
              </p>
              <p>
                {claim.nonprofit.address.address_line_1}
                <br />
                {claim.nonprofit.address.address_line_2}
                <br />
                {claim.nonprofit.address.city}, {claim.nonprofit.address.state},{' '}
                {claim.nonprofit.address.zip}
              </p>
            </Col>
          </Row>

          <Row>
            <Col>
              <p>
                <b>Nonprofit Mission Statement: </b>
              </p>
              <p>{claim.nonprofit.mission}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                <b>Nonprofit Description: </b>
              </p>
              <p>{claim.nonprofit.description}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>Cummulated donation amount: $13200</p>
            </Col>
          </Row>

          <div>
            <Button className="mr-1" onClick={() => openModal('approve')} variant="success">
              {' '}
              Approve
            </Button>
            <Button onClick={() => openModal('deny')} variant="danger">
              Deny
            </Button>
          </div>
        </Container>
      </Jumbotron>
      <ConfirmationModal
        show={show}
        choice={choice}
        onClose={() => setShow(false)}
        onApprove={msg => {
          approveClaim(claim.id, history, msg);
          addNotification(`${claim.nonprofit.name} - Approved`, 'success');
        }}
        onDeny={msg => {
          denyClaim(claim.id, history, msg);
          addNotification(`${claim.nonprofit.name} - Denied`, 'fail');
        }}
      />
    </Fragment>
  );
};

ClaimInfo.propTypes = {
  addNotification: PropTypes.func.isRequired,
  getClaim: PropTypes.func.isRequired,
  approveClaim: PropTypes.func.isRequired,
  denyClaim: PropTypes.func.isRequired,
  claim: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  claim: state.claims,
});

export default connect(mapStateToProps, { addNotification, getClaim, approveClaim, denyClaim })(
  ClaimInfo
);
