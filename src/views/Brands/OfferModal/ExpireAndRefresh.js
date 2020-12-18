import React, { useState, Fragment, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import Col from 'react-bootstrap/Col';


function RefreshAndExpire() {
    const [showA, setShowA] = useState(false);
    const toggleShowA = () => setShowA(!showA);
    const [expireText, setExpireText] = useState('')
    const [btnDisabled, setBtnDisabled] = useState(true)

    useEffect(() => {
        if (expireText === 'I AM SURE') {
            setBtnDisabled(false)
        }
        return () => setBtnDisabled(true)
    }, [expireText])

    const handleChange = (e) => {
        setExpireText(e.target.value)
    }
    return (
        <Fragment>
            <Form.Row className="mt-3">
                <Form.Group as={Col}>
                    <Button onClick={toggleShowA}>
                        Expire and Refresh Offer
                    </Button>
                    <Toast className="mt-3" show={showA} onClose={toggleShowA}>
                        <Toast.Header>
                            <strong className="mr-auto">Are you sure?</strong>
                            <small>11 mins ago</small>
                        </Toast.Header>
                        <Toast.Body>
                            <p>
                                Are you sure you want to expire this offer? Type below {' '}
                                <span className="text-danger">I AM SURE</span>
                            </p>
                            <Form.Control
                                name={`Expire and Refresh`}
                                value={expireText}
                                onChange={handleChange}
                            />
                            <Button className="mt-3" disabled={btnDisabled} type="submit">Confirm</Button>
                        </Toast.Body>
                    </Toast>
                </Form.Group>
            </Form.Row>
        </Fragment>
    )
}

export default RefreshAndExpire;