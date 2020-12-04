import React, { Fragment } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { createSchema, max255, stringArray } from 'utils/schema';
import { getSearchQuery } from 'utils';
import { values } from 'lodash';

const searchSchema = createSchema({
  offer_activation_id: max255,
  gd_status: stringArray,
});

const SearchInput = () => {
  const formik = useFormik({
    validationSchema: searchSchema,
    initialValues: {
      offer_activation_id: '',
      gd_status: [],
    },
    onSubmit: values => console.log('onsubmit', values),
  });
  function appendStatus(e, status) {
    return e.target.checked
      ? [...formik.values.gd_status, status]
      : [...formik.values.gd_status.filter(el => el !== status)];
  }

  return (
    <Fragment>
      <h3>Search Affliate Transactions</h3>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Form.Group controlId="searchNp">
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
        </Form.Group>

        <Button type="submit">Search</Button>
      </Form>
    </Fragment>
  );
};

export default SearchInput;
