import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import moment from 'moment';
import { useFormik } from 'formik';
import {
  object as yupObject,
  number as yupNumber,
  string as yupString,
  boolean as yupBoolean,
} from 'yup';

const initialState = {
  base_consumer_payout: '',
  begins_at: '',
  ends_at: '',
  commission: '',
  commission_type: '',
  disclaimer: '',
  is_disabled: '',
  is_groomed: '',
  offer_guid: '',
  offer_type: '',
  supported_nonprofit_id: '',
};

const schema = yupObject({
  begins_at: yupString().required('Begins at date cannot be empty.'),
  ends_at: yupString().required('Ends at date cannot be empty.'),
  base_consumer_payout: yupNumber().required('Consumer Payout cannot be empty.'),
  commission: yupNumber().required('Commission cannot be empty.'),
  commission_type: yupString().required('Commission Type cannot be empty.'),
  disclaimer: yupString().required('Disclaimer cannot be empty.'),
  is_disabled: yupBoolean().required('Visibility cannot be empty.'),
  is_groomed: yupBoolean().required('Groomed status cannot be empty.'),
  supported_nonprofit_id: yupNumber().required('Supported Nonprofit ID cannot be empty.'),
});

const APModal = ({ show, handleClose, offer }) => {
  // const [formData, setFormData] = useState(initialState);

  // useEffect(() => {
  //   if (offer) {
  //     setFormData(offer);
  //   }
  // }, [offer]);

  const formik = useFormik({
    validationSchema: schema,
    initialValues: offer,
    onSubmit: values => {
      // const time = moment().utc().format();
      // setFormData({ ...values, modified_at: time });
      console.log(values);
    },
  });

  // const { offer_guid, offer_type } = formData;

  if (offer) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{offer.offer_guid}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
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
                  value={formik.values.supported_nonprofit_id}
                  aria-describedby="supported_nonprofit_id"
                  onChange={formik.handleChange}
                  isInvalid={!!formik.errors.supported_nonprofit_id}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.supported_nonprofit_id}
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
                  value={moment(formik.values.begins_at).format('yyyy-MM-DD')}
                  id="begins_at"
                  aria-describedby="begins_at"
                  onChange={formik.handleChange}
                  isInvalid={!!formik.errors.begins_at}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.begins_at}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  <b>End Date:</b>
                </Form.Label>
                <Form.Control
                  type="date"
                  value={moment(formik.values.ends_at).format('yyyy-MM-DD')}
                  id="ends_at"
                  aria-describedby="ends_at"
                  onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.ends_at}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>
                  <b>Commission:</b>
                </Form.Label>
                <Form.Control
                  value={formik.values.commission}
                  id="commission"
                  aria-describedby="commission"
                  onChange={formik.handleChange}
                  isInvalid={!!formik.errors.commission}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.commission}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  <b>Commission Type:</b>
                </Form.Label>
                <Form.Control
                  value={formik.values.commission_type}
                  id="commission_type"
                  aria-describedby="commission_type"
                  onChange={formik.handleChange}
                  isInvalid={!!formik.errors.commission_type}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.commission_type}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>
                  <b>Consumer Payout:</b>
                </Form.Label>
                <Form.Control
                  value={formik.values.base_consumer_payout}
                  id="base_consumer_payout"
                  aria-describedby="base_consumer_payout"
                  isInvalid={!!formik.errors.base_consumer_payout}
                  onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.base_consumer_payout}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>
                  <b>Disclaimer:</b>
                </Form.Label>
                <Form.Control
                  value={formik.values.disclaimer}
                  id="disclaimer"
                  aria-describedby="disclaimer"
                  isInvalid={!!formik.errors.disclaimer}
                  onChange={formik.handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.disclaimer}
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
                  defaultValue={formik.values.is_disabled}
                  aria-describedby="is_disabled"
                  onChange={formik.handleChange}
                  isInvalid={!!formik.errors.is_disabled}
                >
                  <option value={true}>Disabled</option>
                  <option value={false}>Enabled</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.disclaimer}
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
                  defaultValue={formik.values.is_groomed}
                  aria-describedby="is_groomed"
                  onChange={formik.handleChange}
                >
                  <option value={true}>Complete</option>
                  <option value={false}>Incomplete</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.is_groomed}
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
        </Modal.Body>

        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  }
  return null;
};

export default APModal;
