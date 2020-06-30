import React, { Fragment, useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';
import userService from 'services/user';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [completed, setCompleted] = useState(false);
  
  const [formError, setFormError] = useState(null);
  
  const onChange = e => setEmail(e.target.value);

  const onSubmit = async e => {
    e.preventDefault();
    const [err, result] = await userService.resetPassword(email);
    console.log(result);
    if (err) {
      setFormError(err.message);
      return;
    }
    if (result) {
      setCompleted(true)
    }
    setFormError(null); // clear error
  };


  return (
    <Fragment>
      <PageHeader pageTitle="Reset Password" />
      <Row>
        <Col md={6}>
          {completed && <Alert variant="success">A password reset link was emailed to {email}</Alert>}
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form onSubmit={onSubmit}>
            <Form.Group controlId="loginEmail">
              <Form.Label className="email">
                <b>Email</b>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Email Address"
                name="email"
                onChange={e => onChange(e)}
                value={email}
                required
              />
            </Form.Group>
            <Button type="submit" value="Reset Password">
              Reset Password
            </Button>
          </Form>
        </Col>
      </Row>
    </Fragment>
  );
};


export default ResetPassword;
