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
import PageHeader from 'components/PageHeader';

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

  const ConfirmationModal = ({ show, choice }) => {
    const [msg, setMsg] = useState({
      note: '',
    });
    const onChange = e => setMsg({ ...msg, note: e.target.value });

    const claimChoice = e => {
      setShow(false);
      if (e === 'approve') {
        approveClaim(claim._id, history, msg);
        addNotification(`${claim.name} - Approved`, 'success');
      } else if (e === 'deny') {
        denyClaim(claim._id, history, msg);
        addNotification(`${claim.name} - Denied`, 'fail');
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
      <Jumbotron>
        <Container>
          <Row>
            <Col>
              <h1>{claim.name}</h1>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Moment format="YYYY/MM/DD">{claim.date}</Moment>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <p>
                <b>EIN#: </b>
                {claim.ein}
              </p>
              <p>
                <b>GuideStar id#: </b>
                {claim.guidestar_id}
              </p>
              <p>
                <b>Bridge id#: </b>
                {claim.bridge_id}
              </p>
              <p>
                <b>Contact-name: </b> {claim.contact_name}
              </p>
              <p>
                <b>Contact-Email: </b> {claim.contact_email}
              </p>
            </Col>
            <Col>
              <p>
                <b>Address: </b>
              </p>
              <p>{claim.address.address_line_1}</p>
              <p>{claim.address.address_line_2}</p>
              <p>
                {claim.address.city}, {claim.address.state}, {claim.address.zip}
              </p>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <p>
                <b>Mission Statement: </b>
              </p>
              <p>{claim.mission}</p>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <p>
                <b>Description: </b>
              </p>
              <p>{claim.description}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>Cummulated donation amount: $13200</p>
            </Col>
          </Row>

          <div>
            <Button onClick={() => openModal('approve')}> Approve</Button>{' '}
            <Button onClick={() => openModal('deny')} variant="secondary">
              Deny
            </Button>
          </div>
        </Container>
      </Jumbotron>
      <ConfirmationModal show={show} choice={choice} />
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
