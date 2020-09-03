import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { useClaim, useUpdateClaim } from 'hooks/useClaims';
import Spinner from 'components/Spinner';
import styles from './Claim.module.scss';
import { connect } from 'react-redux';
import { addNotification } from 'actions/notifications';
import { cn } from 'gdd-components/dist/utils';
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

  const cn = choice === 'approve' ? styles.approve : styles.deny;
  const action = choice === 'approve' ? 'Approval' : 'Denial';

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton onClick={onClose} className={cn}>
        <Modal.Title>Please Confirm {action}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          You are about to <strong>{choice}</strong> this claim.
        </p>
        <p>Please leave a feedback comment that will be sent to the nonprofit.</p>
        <br />
        <InputGroup>
          <FormControl
            as="textarea"
            maxLength="2000"
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
          Save {action}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ClaimInfo = ({ addNotification, match }) => {
  const [show, setShow] = useState(false);
  const [choice, decision] = useState('');

  const { isLoading, isError, data: claim, error } = useClaim(match.params.id);
  const [updateClaim, { status: claimUpdateStatus }] = useUpdateClaim();

  const openModal = e => {
    decision(e);
    setShow(true);
  };

  if (isLoading) {
    return <Spinner fullPage={true} />;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <Fragment>
      <Container>
        <Row className={cn('mb-4', styles.statusRow)}>
          <Col>
            <h3>
              Status:{' '}
              <span className={cn(styles.status, styles[claim.status])}>{claim.status}</span>
            </h3>
            {claim.note && claim.note.length > 0 && (
              <>
                <h4>Note:</h4>
                <p>{claim.note}</p>
              </>
            )}
          </Col>
        </Row>
      </Container>
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
                <b>Location: </b>
              </p>
              <p>{claim.nonprofit.location}</p>
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
          {(!claim.status || claim.status === 'waiting') && (
            <div>
              <Button className="mr-1" onClick={() => openModal('approve')} variant="success">
                Approve
              </Button>
              <Button onClick={() => openModal('deny')} variant="danger">
                Deny
              </Button>
            </div>
          )}
        </Container>
      </Jumbotron>
      <ConfirmationModal
        show={show}
        choice={choice}
        onClose={() => setShow(false)}
        status={claimUpdateStatus}
        onApprove={msg => {
          updateClaim({ id: claim.id, status: 'approve', note: msg.note });
          addNotification(`${claim.nonprofit.name} - Approved`, 'success');
        }}
        onDeny={msg => {
          updateClaim({ id: claim.id, status: 'deny', note: msg.note });
          addNotification(`${claim.nonprofit.name} - Denied`, 'fail');
        }}
      />
    </Fragment>
  );
};

ClaimInfo.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default connect(null, { addNotification })(ClaimInfo);
