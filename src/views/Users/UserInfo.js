import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import PageHeader from 'components/PageHeader';
import { addNotification } from 'actions/notifications';
import { useGetUser } from 'hooks/useUsers';
import styles from './User.module.scss';
import Spinner from 'components/Spinner';
import ConsumerUser from './ConsumerUser';

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

function UserInfo({ match, addNotification }) {
  const { id, type } = match.params;
  // const [show, setShow] = useState(false);
  // const [edit, toggleEdit] = useState(true);
  const { isLoading, isError, data, error } = useGetUser(id, type);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  if (type === 'consumer') {
    return (
      <>
        <ConsumerUser data={data} />
      </>
    );
  } else if (type === 'brand') {
    return (
      <>
        <PageHeader pageTitle="Brand user info" />
      </>
    );
  } else if (type === 'internal') {
    return (
      <>
        <PageHeader pageTitle="Internal user info" />
      </>
    );
  } else {
    return <p>type: {type} not supported yet</p>;
  }
}

UserInfo.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default connect(null, { addNotification })(UserInfo);
