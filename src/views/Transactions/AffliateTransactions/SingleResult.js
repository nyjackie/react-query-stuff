import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { Card, Modal, Button } from 'react-bootstrap';
import { DateTime } from 'luxon';
import { useUpdateTransaction } from 'hooks/useTransaction';
import { cn } from 'gdd-components/dist/utils';
import { setNotification } from 'actions/notifications';
import styles from './AffiliateTransactions.module.scss';

const ResultModal = ({ item, show, setShow, onSave }) => {
  const { affluent_date_created, affluent_date_modified, gd_status, transaction_guid } = item;
  const [status, setStatus] = useState(gd_status);
  const onChange = e => {
    setStatus(e.target.value);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          GUID: {transaction_guid}{' '}
          <span className={cn(styles.status, styles[gd_status.toLowerCase()])}>{gd_status}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col">
            Date Created: {DateTime.fromISO(affluent_date_created).toFormat('MM/dd/yy, tt')}
          </div>
          <div className="col">
            Date Modified: {DateTime.fromISO(affluent_date_modified).toFormat('MM/dd/yy, tt')}
          </div>
        </div>
        <div className="row">
          <div className="col">
            <pre>{JSON.stringify(item, undefined, 2)}</pre>
          </div>
        </div>
        <div className="row">
          <div className="col">
            Change Status:
            <select
              className="mt-2 mb-2 form-control w-auto"
              defaultValue={gd_status}
              onChange={onChange}
            >
              <option value="PENDING">PENDING</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="NONPROFIT_PAID">Nonprofit Paid</option>
              <option value="CONSUMER_PAID">Consumer Paid</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={() => onSave(status, transaction_guid)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const SingleResult = ({ item, setNotification }) => {
  const [show, setShow] = useState(false);
  const [updateAffiliateTransactionsGDStatus] = useUpdateTransaction();
  const {
    activation_id,
    affluent_date_created,
    gd_status,
    consumer_payout,
    nonprofit_payout,
    revenue,
    user_id,
    nonprofit_id,
    transaction_guid,
  } = item;

  const onSave = async (status, transaction_guid) => {
    try {
      await updateAffiliateTransactionsGDStatus({
        gd_status: status,
        transaction_guid: transaction_guid,
      });
      setNotification(`${transaction_guid} has been updated to ${status}`, 'success');
    } catch (err) {
      setNotification(`Update failed. Please try again later.`, 'error');
    }
  };

  return (
    <Fragment>
      <Card className="w-100 pointer m-1" onClick={() => setShow(true)}>
        <Card.Body>
          <Card.Title>
            <span className={cn(styles.status, styles[gd_status.toLowerCase()])}>{gd_status}</span>{' '}
            {transaction_guid}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Created: {DateTime.fromISO(affluent_date_created).toFormat('MM/dd/yy, tt')}
          </Card.Subtitle>
          <Card.Text>
            <span className="row">
              <span className="col">Activation ID: {activation_id}</span>
              <span className="col">User ID: {user_id}</span>
              <span className="col">Nonprofit ID: {nonprofit_id}</span>
            </span>
            <span className="row">
              <span className="col">Consumer Payout: ${consumer_payout}</span>
              <span className="col">Nonprofit Payout: ${nonprofit_payout}</span>
              <span className="col">Revenue: ${revenue}</span>
            </span>
          </Card.Text>
        </Card.Body>
      </Card>
      <ResultModal item={item} show={show} setShow={setShow} onSave={onSave} />
    </Fragment>
  );
};

export default connect(null, { setNotification })(SingleResult);
