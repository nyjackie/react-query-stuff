import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import { ReactComponent as LogoSpinner } from 'assets/logo-spinner.svg';

export default ({ show, fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <LogoSpinner />
      </div>
    );
  }

  return (
    <Modal show={show} backdrop="static">
      <div className="d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    </Modal>
  );
};
