import React, { useState, Fragment, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import Col from 'react-bootstrap/Col';

const RefreshAndExpire = () => {
    const [showA, setShowA] = useState(false);
    const toggleShowA = () => setShowA(!showA);
    const [expireText, setExpireText] = useState('');
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [newOffer, setNewOffer] = useState(null)
    const [error, setError] = useState([])
    const url = 'https://endpointsportal.gdd-backend-asgard-staging.cloud.goog/docs/bifrost.endpoints.gdd-backend-asgard-staging.cloud.goog/0/routes/portal/internal/offer/refresh/post'

    useEffect(() => {
        if (expireText === 'I AM SURE') {
            setBtnDisabled(false)
        }
        return () => setBtnDisabled(true)
    }, [expireText])

    const handleChange = e => setExpireText(e.target.value)

    const handleConfirm = async e => {
        try {
            const response = await axios.post(url)
            setNewOffer(response.data)
        } catch (err) {
            console.log(err)
            setError(err)
        }
    }
    
    return (
        <Fragment>
            <Form.Row className="mt-3">
                <Form.Group as={Col}>
                    <Button onClick={toggleShowA}>
                        {/* <span style={{ color: 'white' }}>
                            <i className="fa fa-sync" />
                        </span> */}
                        Expire and Refresh Offer
                    </Button>
                    <Toast className="mt-3" show={showA} onClose={toggleShowA}>
                        <Toast.Header>
                            <strong className="mr-auto">Are you sure?</strong>
                            <small>11 mins ago</small>
                        </Toast.Header>
                        <Toast.Body>
                            <p>
                                Are you sure you want to expire this offer? 
                                <br />
                                You cannot undo this.
                                <br />
                                Type below {' '}
                                <span className="text-danger">I AM SURE</span>
                            </p>
                            <Form.Control
                                name={`Expire and Refresh`}
                                value={expireText}
                                onChange={handleChange}
                            />
                            <Button className="mt-3" disabled={btnDisabled} onClick={handleConfirm}>
                                Confirm
                            </Button>
                        </Toast.Body>
                    </Toast>
                    <p>{newOffer || error.message}</p>
                </Form.Group>
            </Form.Row>
        </Fragment>
    )
}

export default RefreshAndExpire;