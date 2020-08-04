import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Modal, Button, Col, Row, Jumbotron, Form } from 'react-bootstrap';
import { connect } from 'react-redux';

import PageHeader from 'components/PageHeader';
import { addNotification } from 'actions/notifications';
import { useGetUser } from 'hooks/useUsers';
import styles from './User.module.scss';
import Spinner from 'components/Spinner';

const Confirm = ({ show, onBan, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} dialogClassName={styles.confModal}>
      <Modal.Header closeButton>
        <Modal.Title>ARE YOU SURE?</Modal.Title>
      </Modal.Header>
      <Modal.Body>This is the last warning!</Modal.Body>
      <Modal.Footer className="justify-content-start">
        <Button variant="danger" onClick={onBan}>
          Ban
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const BanModal = ({ show, onClose, user }) => {
  const [confirmation, setConfirmation] = useState(false);

  const banUser = e => {
    console.log('will ban this user', user);
    // close the confirmation modal
    setConfirmation(false);
    // close this modal
    onClose();

    // make post request here...
    // api.post request
    // handle result
  };

  return (
    <Fragment>
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ban Current User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You are about to ban this user, are you sure?</p>
          <p>
            <b>TODO: do we need to add a note for why they are being banned here?</b>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setConfirmation(true)}>
            Ban
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Confirm show={confirmation} onBan={banUser} onClose={() => setConfirmation(false)} />
    </Fragment>
  );
};

const initialState = {
  first_name: '',
  last_name: '',
  contact_email: '',
  contact_phone: '',
  profile_status: {
    status: '',
    description: '',
  },
  created_at: '',
  modified_at: '',
};

function UserInfo({ match, addNotification }) {
  const { id } = match.params;
  const [show, setShow] = useState(false);
  const [edit, toggleEdit] = useState(true);
  const { isLoading, isError, data, error } = useGetUser(id);
  const [formData, setFormData] = useState(initialState);

  const onChange = e => {
    if (e.target.name === 'status' || e.target.name === 'description') {
      setFormData({
        ...formData,
        profile_status: { ...formData.profile_status, [e.target.name]: e.target.value },
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const onSubmit = e => {
    e.preventDefault();
    const time = moment().utc().format();
    setFormData({ ...formData, modified_at: time });
    console.log('Form data', formData);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  const {
    first_name,
    last_name,
    contact_email,
    contact_phone,
    profile_status: { status, description },
    created_at,
    modified_at,
  } = formData;

  return (
    <Fragment>
      <PageHeader className="text-primary" pageTitle="User Info" />
      <Jumbotron className={styles.jumbotron}>
        <Button
          onClick={() => {
            toggleEdit(!edit);
          }}
          className={styles.edit}
        >
          Edit
        </Button>
        <Form onSubmit={onSubmit}>
          <Form.Row>
            <Col xl={6}>
              <Form.Group as={Row} controlId="create_at">
                <Form.Label column xl={3}>
                  Created at:
                </Form.Label>
                <Col>
                  <Form.Control
                    plaintext
                    readOnly
                    value={moment(created_at).format('MM/DD/YYYY')}
                  />
                </Col>
              </Form.Group>
            </Col>
            <Col xl={6}>
              <Form.Group as={Row} controlId="modified_at">
                <Form.Label column xl={3}>
                  Modified at:
                </Form.Label>
                <Col>
                  <Form.Control
                    plaintext
                    readOnly
                    value={moment(modified_at).format('MM/DD/YYYY')}
                  />
                </Col>
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col xl={6}>
              <Form.Group as={Row} controlId="first_name">
                <Form.Label column xl={3}>
                  First Name:
                </Form.Label>
                <Col>
                  <Form.Control
                    plaintext={edit}
                    readOnly={edit}
                    name="first_name"
                    value={first_name}
                    onChange={onChange}
                  />
                </Col>
              </Form.Group>
            </Col>
            <Col xl={6}>
              <Form.Group as={Row} controlId="last_name">
                <Form.Label column xl={3}>
                  Last Name:
                </Form.Label>
                <Col>
                  <Form.Control
                    plaintext={edit}
                    readOnly={edit}
                    name="last_name"
                    value={last_name}
                    onChange={onChange}
                  />
                </Col>
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col xl={6}>
              <Form.Group as={Row} controlId="email">
                <Form.Label column xl={3}>
                  Email:
                </Form.Label>
                <Col>
                  <Form.Control
                    plaintext={edit}
                    readOnly={edit}
                    type="email"
                    name="contact_email"
                    value={contact_email}
                    onChange={onChange}
                  />
                </Col>
              </Form.Group>
            </Col>
            <Col xl={6}>
              <Form.Group as={Row} controlId="phone">
                <Form.Label column xl={3}>
                  Phone#:
                </Form.Label>
                <Col>
                  <Form.Control
                    plaintext={edit}
                    readOnly={edit}
                    type="tel"
                    name="contact_phone"
                    value={contact_phone}
                    onChange={onChange}
                  />
                </Col>
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col xl={6}>
              <Form.Group as={Row} controlId="formGridStatus">
                <Form.Label column xl={3}>
                  Status:
                </Form.Label>
                <Col>
                  <Form.Control
                    className={styles.select}
                    plaintext={edit}
                    readOnly={edit}
                    disabled={edit}
                    as="select"
                    name="status"
                    defaultValue={status}
                    onChange={onChange}
                    custom
                  >
                    <option>active</option>
                    <option>inactive</option>
                  </Form.Control>
                </Col>
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Row>
            <Col>
              <Form.Group as={Row} controlId="formGridStatus">
                <Form.Label column xl={12}>
                  Description:
                </Form.Label>
                <Col>
                  <Form.Control
                    className={styles.textarea}
                    rows="8"
                    plaintext={edit}
                    readOnly={edit}
                    disabled={edit}
                    as="textarea"
                    name="description"
                    defaultValue={description}
                    onChange={onChange}
                  />
                </Col>
              </Form.Group>
            </Col>
          </Form.Row>
          <Row>
            <Col>{!edit && <Button type="submit">Submit</Button>}</Col>
            <Col>
              <Button variant="danger" className={styles.ban} onClick={() => setShow(true)}>
                Ban
              </Button>
            </Col>
          </Row>
        </Form>
        <BanModal show={show} onClose={() => setShow(false)} user={data} />
      </Jumbotron>
    </Fragment>
  );
}

UserInfo.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default connect(null, { addNotification })(UserInfo);
