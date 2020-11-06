import React, { useState } from 'react';
import styles from './User.module.scss';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function SendForgotPasswordButton({ email, useForgotPassword, new_template = false, ...props }) {
  let [sendForgotPassword, { isSuccess, isLoading, isError, reset }] =
    useForgotPassword(email, new_template);

  return (
    <Button
      onClick={(isSuccess || isError) ? reset : sendForgotPassword}
      variant={isSuccess ? "success" : (isError ? "danger" : "primary")}
      disabled={isLoading}
      className={styles.edit}
      {...props}
    >
      <span className={`fadable ${!(isLoading || isSuccess || isError) ? 'active' : ''}`}>
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
      {isError &&
        <div className="absolute-center" style={{ height: 'fit-content' }}>
          <span className={`fadable ${isError ? 'active' : ''}`}>Error</span>
        </div>
      }
    </Button>
  );
}

export default SendForgotPasswordButton;
