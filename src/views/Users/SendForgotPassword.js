import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export const TEMPLATES = {
  NEW_NONPROFIT: 'new_nonprofit',
  NEW_BRAND: 'new_brand',
};

function SendForgotPassword({ email, hook, new_template = false }) {
  const [sendForgotPassword, { isSuccess, isLoading, error }] = hook(email, new_template);
  console.log(isSuccess, isLoading, error);

  const buttonCopy = new_template
    ? 'Send new user password reset email'
    : 'Send this user a password reset email';

  return (
    <Container className="block shadow-sm">
      <Row>
        <Col>
          <p>{email}</p>
          <Button
            onClick={sendForgotPassword}
            variant="primary"
            disabled={isSuccess || isLoading}
          >
            {buttonCopy}
          </Button>
          {new_template && (
            <p>
              <small>This will use the "new user" email template</small>
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
