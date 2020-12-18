import React, { Fragment } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { createSchema, max255, stringArray } from 'utils/schema';

const searchSchema = createSchema({
  offer_activation_id: max255,
  gd_status: stringArray.required('Please select a status'),
  user_id: max255,
});

const SearchInput = ({ history, location }) => {
  const formik = useFormik({
    validationSchema: searchSchema,
    initialValues: {
      offer_activation_id: '',
      user_id: '',
      gd_status: [],
    },
    onSubmit: values =>
      updateUrl(values.offer_activation_id, values.user_id, values.gd_status.join(), 20, 0),
  });

  function updateUrl(offer_activation_id, user_id, gd_status, limit, offset) {
    const query = { offer_activation_id, user_id, gd_status, limit: limit, offset: offset };
    let param = new URLSearchParams(query);
    history.push(`${location.pathname}?${param.toString()}`);
  }

  function appendStatus(e, status) {
    return e.target.checked
      ? [...formik.values.gd_status, status]
      : [...formik.values.gd_status.filter(el => el !== status)];
  }

  return (
    <Fragment>
      <h3>Search Affliate Transactions</h3>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Form.Group controlId="searchID">
          <Form.Label>Activation ID</Form.Label>
          <Form.Control
            type="offer_activation_id"
            name="offer_activation_id"
            autoFocus
            onChange={formik.handleChange}
            value={formik.values.offer_activation_id}
            isInvalid={formik.touched.offer_activation_id && formik.errors.offer_activation_id}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.offer_activation_id}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="searchUser">
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type="user_id"
            name="user_id"
            autoFocus
            onChange={formik.handleChange}
            value={formik.values.user_id}
            isInvalid={formik.touched.user_id && formik.errors.user_id}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.offer_activation_id}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Check
            inline
            name="gd_status"
            label="PENDING"
            onChange={e => formik.setFieldValue('gd_status', appendStatus(e, 'PENDING'))}
            isInvalid={!!formik.errors.terms}
            feedback={formik.errors.terms}
            id="PENDING"
          />
          <Form.Check
            inline
            name="gd_status"
            label="AVAILABLE"
            onChange={e => formik.setFieldValue('gd_status', appendStatus(e, 'AVAILABLE'))}
            id="AVAILABLE"
          />
          <Form.Check
            inline
            name="gd_status"
            label="NONPROFIT PAID"
            onChange={e => formik.setFieldValue('gd_status', appendStatus(e, 'NONPROFIT_PAID'))}
            id="NONPROFIT_PAID"
          />
          <Form.Check
            inline
            name="gd_status"
            label="CONSUMER PAID"
            onChange={e => formik.setFieldValue('gd_status', appendStatus(e, 'CONSUMER_PAID'))}
            id="CONSUMER_PAID"
          />
          <Form.Check
            inline
            name="gd_status"
            label="PAID"
            onChange={e => formik.setFieldValue('gd_status', appendStatus(e, 'PAID'))}
            id="PAID"
          />
          <div className="text-danger">{formik.errors.gd_status}</div>
        </Form.Group>
        <Button type="submit">Search</Button>
      </Form>
    </Fragment>
  );
};

export default SearchInput;
