import React, { useState } from 'react';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { AjaxButton } from 'gdd-components';
import { useClaimOptions, useRequestInfo } from 'hooks/useClaims';
import { setNotification } from 'actions/notifications';

function RequestInfoButton({ claim_id, setNotification, className = null }) {
  const { data, isLoading: loadingOptions } = useClaimOptions();
  const [postRequest, { isLoading, isError, isSuccess }] = useRequestInfo();
  const [show, setShow] = useState(false);
  const [val, setVal] = useState(null);
  const [validated, setValidated] = useState(false);

  function handleChange(e) {
    setVal(e.target.value);
  }

  async function handleSubmit(e) {
    const form = e.currentTarget;
    e.preventDefault();

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else if (val) {
      try {
        await postRequest({
          claim_id,
          template_name: val,
        });
        setNotification('Request info successfully sent', 'success');
        setShow(false);
      } catch (err) {
        setNotification(`An error occurred ${err.response?.data?.message || err.message}`, 'error');
      }
    }

    setValidated(true);
  }

  return (
    <>
      <Button
        className={className}
        onClick={() => {
          setShow(true);
        }}
      >
        Request info
      </Button>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request more info</Modal.Title>
        </Modal.Header>

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group>
              <p>Select a reason:</p>
              {data?.map(opt => (
                <Form.Check
                  required
                  className="pb-2 pt-2"
                  key={`req-info-option-${opt.id}`}
                  custom
                  name="request-info"
                  type="radio"
                  label={opt.description}
                  value={opt.template_name}
                  onChange={handleChange}
                  id={`req-info-option-${opt.id}`}
                />
              ))}
              <Form.Control.Feedback type="invalid" className={validated && !val && 'd-block'}>
                Please choose one.
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="d-flex">
            <Button
              className="flex-grow-1"
              variant="secondary"
              onClick={() => {
                setShow(false);
              }}
            >
              Close
            </Button>
            <AjaxButton
              className="flex-grow-1"
              type="submit"
              text="Submit"
              disabled={loadingOptions}
              isLoading={isLoading}
              isError={isError}
              isSuccess={isSuccess}
              successText="Request sent"
              loadingText="Submitting..."
              errorText="Error"
            />
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default connect(null, { setNotification })(RequestInfoButton);
