import React from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import moment from 'moment';
import { Formik } from 'formik';
import {
  object as yupObject,
  number as yupNumber,
  string as yupString,
  boolean as yupBoolean,
} from 'yup';

// const initialState = {
//   base_consumer_payout: '',
//   begins_at: '',
//   ends_at: '',
//   commission: '',
//   commission_type: '',
//   disclaimer: '',
//   is_disabled: '',
//   is_groomed: '',
//   offer_guid: '',
//   offer_type: '',
//   supported_nonprofit_id: '',
// };

const schema = yupObject({
  begins_at: yupString().required('Begins at date cannot be empty.'),
  ends_at: yupString().required('Ends at date cannot be empty.'),
  base_consumer_payout: yupNumber()
    .typeError('Consumer Payout must be a number')
    .required('Consumer Payout cannot be empty.'),
  commission: yupNumber()
    .typeError('Commission must be a number')
    .required('Commission cannot be empty.'),
  commission_type: yupString().required('Commission Type cannot be empty.'),
  disclaimer: yupString().required('Disclaimer cannot be empty.'),
  is_disabled: yupBoolean().required('Visibility cannot be empty.'),
  is_groomed: yupBoolean().required('Groomed status cannot be empty.'),
  supported_nonprofit_id: yupNumber()
    .typeError('Supported Nonprofit ID must be a number')
    .required('Supported Nonprofit ID cannot be empty.'),
});

const APModal = ({ show, handleClose, offer }) => {
  if (offer) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{offer.offer_guid}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={offer}
            validationSchema={schema}
            onSubmit={(values, { setSubmitting }) => {
              console.log(values);
            }}
          >
            {props => {
              const { values, errors, handleSubmit, handleChange } = props;
              return (
                <Form onSubmit={handleSubmit}>
                  <Row className="form-row">
                    <Col className="form-col">
                      <p>
                        <b>Offer ID: </b>
                      </p>
                      <p>{offer.offer_guid}</p>
                    </Col>
                    <Col className="form-col">
                      <p>
                        <b>Offer Type: </b>
                      </p>
                      <p>{offer.offer_type}</p>
                    </Col>
                  </Row>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>
                        <b>Supported Nonprofit ID: </b>
                      </Form.Label>
                      <Form.Control
                        name="supported_nonprofit_id"
                        value={values.supported_nonprofit_id}
                        aria-describedby="supported_nonprofit_id"
                        onChange={handleChange}
                        isInvalid={!!errors.supported_nonprofit_id}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.supported_nonprofit_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>
                        <b>Start Date:</b>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={moment(values.begins_at).format('yyyy-MM-DD')}
                        id="begins_at"
                        aria-describedby="begins_at"
                        onChange={handleChange}
                        isInvalid={!!errors.begins_at}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.begins_at}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>
                        <b>End Date:</b>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={moment(values.ends_at).format('yyyy-MM-DD')}
                        id="ends_at"
                        aria-describedby="ends_at"
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">{errors.ends_at}</Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>
                        <b>Commission:</b>
                      </Form.Label>
                      <Form.Control
                        value={values.commission}
                        id="commission"
                        aria-describedby="commission"
                        onChange={handleChange}
                        isInvalid={!!errors.commission}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.commission}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>
                        <b>Commission Type:</b>
                      </Form.Label>
                      <Form.Control
                        value={values.commission_type}
                        id="commission_type"
                        aria-describedby="commission_type"
                        onChange={handleChange}
                        isInvalid={!!errors.commission_type}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.commission_type}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>

                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>
                        <b>Consumer Payout:</b>
                      </Form.Label>
                      <Form.Control
                        value={values.base_consumer_payout}
                        id="base_consumer_payout"
                        aria-describedby="base_consumer_payout"
                        isInvalid={!!errors.base_consumer_payout}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.base_consumer_payout}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>
                        <b>Disclaimer:</b>
                      </Form.Label>
                      <Form.Control
                        value={values.disclaimer}
                        id="disclaimer"
                        aria-describedby="disclaimer"
                        isInvalid={!!errors.disclaimer}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.disclaimer}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Form.Label>
                        <b>External Visibility:</b>
                      </Form.Label>
                      <Form.Control
                        custom
                        as="select"
                        name="is_disabled"
                        defaultValue={values.is_disabled}
                        aria-describedby="is_disabled"
                        onChange={handleChange}
                        isInvalid={!!errors.is_disabled}
                      >
                        <option value={true}>Disabled</option>
                        <option value={false}>Enabled</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.disclaimer}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>
                        <b>Groomed Status: </b>
                      </Form.Label>
                      <Form.Control
                        custom
                        as="select"
                        name="is_groomed"
                        defaultValue={values.is_groomed}
                        aria-describedby="is_groomed"
                        onChange={handleChange}
                      >
                        <option value={true}>Complete</option>
                        <option value={false}>Incomplete</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {errors.is_groomed}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Form.Row>
                  <Row>
                    <Col className="text-right">
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" type="submit">
                        Save Changes
                      </Button>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  }
  return null;
};

export default APModal;
