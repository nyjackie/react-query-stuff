import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function SendForgotPassword({ email, hook, new_template = false }) {
  const [finalEmail, setFinalEmail] = useState(null);
  const { isSuccess, isLoading, error } = hook(finalEmail, new_template);

  const buttonCopy = new_template
    ? 'Send new user password reset email'
    : 'Send password reset email';

  return (
    <Container className="block shadow-sm">
      <Row>
        <Col>
          <p>{email}</p>
          <Button
            onClick={() => {
              setFinalEmail(email);
            }}
            variant="primary"
          >
            {buttonCopy}
          </Button>
          {new_template && (
            <p>
              <small>This will send an email using template=new_nonprofit</small>
            </p>
          )}
          {error && (
            <p className="mt-2 text-danger">
              {error.message} - {error.response?.data?.message}
            </p>
          )}
          {isSuccess && <p className="mt-2 text-success">Email Sent!</p>}
          {isLoading && (
            <Spinner as="span" size="md" animation="border" role="status" aria-hidden="true">
              <span className="sr-only">Loading...</span>
            </Spinner>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default SendForgotPassword;
