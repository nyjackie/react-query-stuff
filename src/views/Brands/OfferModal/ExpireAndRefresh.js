import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import Col from 'react-bootstrap/Col';
import { setNotification } from 'actions/notifications';
import { useRefreshOffer } from 'hooks/useOffers';

function ExpireAndRefresh({ offer, setNotification, onSuccess, brand_id }) {
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => setShowA(!showA);
  const [expireText, setExpireText] = useState('');
  const { offer_guid, offer_type } = offer;
  const [refreshOffer] = useRefreshOffer(offer_guid, offer_type, brand_id);

  const handleChange = e => setExpireText(e.target.value);

  const handleConfirm = async e => {
    try {
      await refreshOffer(offer_guid, offer_type);
      setNotification(`Successfully expired and refreshed offer`, 'success');
      onSuccess();
    } catch (err) {
      setNotification(`${err.response?.data?.message || err.message}`, 'error');
    }
  };

  return (
    <Fragment>
      <Form.Row className="mt-3">
        <Form.Group as={Col}>
          <Button onClick={toggleShowA}>
            <span style={{ color: 'white' }}>
              <i className="fa fa-refresh p-2" />
            </span>
            Expire and Refresh Offer
          </Button>
          <Toast className="mt-3" show={showA} onClose={toggleShowA}>
            <Toast.Header>
              <strong className="mr-auto">Are you sure?</strong>
            </Toast.Header>
            <Toast.Body>
              <p>
                Are you sure you want to expire this offer?
                <br />
                You cannot undo this.
              </p>
              <p>
                Type below <span className="text-danger">I AM SURE</span>
              </p>
              <Form.Control
                name={`Expire and Refresh`}
                value={expireText}
                onChange={handleChange}
              />
              <Button
                className="mt-3"
                disabled={expireText !== 'I AM SURE'}
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </Toast.Body>
          </Toast>
        </Form.Group>
      </Form.Row>
    </Fragment>
  );
}

export default connect(null, { setNotification })(ExpireAndRefresh);
