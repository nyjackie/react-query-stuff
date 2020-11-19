import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

/**
 * Inspired by: https://blog.dubenko.dev/confirm-dialog-react/
 */

function Confirm({ giveAnswer, title, message }) {
  return (
    <Modal show={true}>
      {title && (
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}

      <Modal.Body>{message}</Modal.Body>

      <Modal.Footer className="d-flex">
        <Button
          className="flex-grow-1"
          variant="outline-primary"
          onClick={() => {
            giveAnswer(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className="flex-grow-1"
          variant="primary"
          onClick={() => {
            giveAnswer(true);
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const customConfirm = ({ title, message }) => {
  const confirmRoot = document.createElement('div');
  confirmRoot.id = 'confirmRoot';
  const body = document.querySelector('body');

  return new Promise(res => {
    const giveAnswer = answer => {
      ReactDOM.unmountComponentAtNode(confirmRoot);
      body.removeChild(confirmRoot);
      res(answer);
    };

    body.appendChild(confirmRoot);
    ReactDOM.render(
      <Confirm title={title} message={message} giveAnswer={giveAnswer} />,
      confirmRoot
    );
  });
};

export default customConfirm;
