import React, { useState } from 'react';
import styles from './User.module.scss';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function SendForgotPasswordButton({ email, useForgotPassword, new_template = false }) {
  const [sendForgotPassword, { isSuccess, isLoading, error, reset }] =
    useForgotPassword(email, new_template);

  return (
    <div>
      <Button
        onClick={isSuccess ? reset : sendForgotPassword}
        variant={isSuccess ? "success" : "primary"}
        disabled={isLoading}
        className={styles.edit}
        style={{ position: 'relative' }}
      >
        <span className={`fadable ${!(isLoading || isSuccess) ? 'active' : ''}`}>
          Send Password Reset Email
        </span>

        <Spinner
          className={`absolute-center fadable ${isLoading ? 'active' : ''}`}
          as="span"
          size="sm"
          animation="border"
          role="status"
          aria-hidden="true"
        />
        {isLoading && <span className="absolute-center sr-only">Loading...</span>}
        {isSuccess &&
          <div className="absolute-center" style={{ height: 'fit-content' }}>
            <span className={`fadable ${isSuccess ? 'active' : ''}`}>Email Sent!</span>
          </div>
        }
      </Button>
    </div>
  );
}

      //{isLoading && (
      //)}
export default SendForgotPasswordButton;
