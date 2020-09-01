import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { createSchema, phone, max255 } from 'utils/schema';
import { getSearchQuery } from 'utils';

const schema = createSchema({
  email: max255.email('Invalid email format'),
  phone_number: phone,
});

const SearchInput = ({ history, location }) => {
  const query = getSearchQuery();
  const [error, setError] = useState(false);

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      email: query.email || '',
      phone_number: query.phone_number || '',
      user_type: query.user_type || '',
    },
    onSubmit: ({ email, phone_number }) => {
      const phone = phone_number ? phone_number.replace(/[^0-9]+/g, '') : phone_number;
      if (email || phone) {
        const param = new URLSearchParams({ email, phone_number: phone });
        history.push(`${location.pathname}?${param.toString()}`);
      }
      if (!email && !phone) {
        setError('You must enter an email or a phone number');
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Form.Group controlId="searchEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          isInvalid={formik.touched.email && formik.errors.email}
        />
        <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="phone">
        <Form.Label>Phone number</Form.Label>
        <Form.Control
          type="tel"
          name="phone_number"
          onChange={formik.handleChange}
          value={formik.values.phone_number}
          isInvalid={formik.touched.phone_number && formik.errors.phone_number}
        />
        <Form.Control.Feedback type="invalid">{formik.errors.phone_number}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="searchForm">
        <Form.Label>User type</Form.Label>
        <Form.Control
          as="select"
          name="user_type"
          onChange={formik.handleChange}
          value={formik.values.user_type}
          isInvalid={formik.touched.user_type && formik.errors.user_type}
          custom
        >
          <option value="">--Select user type (optional) --</option>
          <option value="consumer">consumer</option>
          <option value="nonprofit">nonprofit</option>
          <option value="internal">internal</option>
          <option value="brand">brand</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">{formik.errors.user_type}</Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" value="Search">
        Search
      </Button>
      {error && <p className="mt-2 text-danger">{error}</p>}
    </Form>
  );
};

export default SearchInput;
