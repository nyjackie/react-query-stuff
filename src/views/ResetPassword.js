import React, { Fragment, useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import { object as yupObject } from 'yup';

import PageHeader from 'components/PageHeader';
import userService from 'services/user';
import validators from 'utils/schema';

const schema = yupObject({
  email: validators.email,
});

const ResetPassword = () => {
  const [completed, setCompleted] = useState(false);
  const [formError, setFormError] = useState(null);

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      email: '',
    },
    onSubmit: async values => {
      const [err, result] = await userService.resetPassword(values.email);

      if (err) {
        setFormError(err.message);
        return;
      }
      if (result) {
        setCompleted(true);
      }
      setFormError(null); // clear error
    },
  });

  return (
    <Fragment>
      <PageHeader pageTitle="Reset Password" />
      <Row>
        <Col md={6}>
          {completed && (
            <Alert variant="success">
              A password reset link was emailed to {formik.values.email}
            </Alert>
          )}
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Form.Group controlId="loginEmail">
              <Form.Label className="email">
                <b>Email</b>
              </Form.Label>
              <Form.Control
                placeholder="Email"
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                isValid={formik.touched.email && !formik.errors.email}
                isInvalid={!!formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" value="Reset Password">
              Reset Password
            </Button>
          </Form>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ResetPassword;
