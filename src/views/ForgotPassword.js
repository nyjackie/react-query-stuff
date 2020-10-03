import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import { useFormik } from 'formik';
import { object as yupObject } from 'yup';
import userService from 'services/user';
import { gddEmailRequired } from 'utils/schema';
import { ReactComponent as Logo } from '../assets/good-deeds-logo-teal.svg';
import styles from './Login.module.scss';

const schema = yupObject({
  email: gddEmailRequired,
});

const ForgotPassword = () => {
  const [completed, setCompleted] = useState(false);
  const [formError, setFormError] = useState(null);

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      email: '',
    },
    onSubmit: async values => {
      const [err, result] = await userService.forgotPassword(values.email);

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
    <Row className="justify-content-md-center">
      <Col md={6} lg={4} className={`${styles.loginPage} block shadow-sm`}>
        <Logo className={styles.logo} aria-hidden="true" />
        <h1 className="sr-only">Give Good Deeds</h1>
        {completed && (
          <Alert variant="success">
            A password reset link was emailed to {formik.values.email}
          </Alert>
        )}
        {formError && <Alert variant="danger">{formError}</Alert>}
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Form.Group controlId="loginEmail">
            <Form.Label>
              <b>Forgot Password</b>
            </Form.Label>
            <Form.Control
              placeholder="Email"
              type="email"
              name="email"
              autoFocus
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              isValid={formik.touched.email && !formik.errors.email}
              isInvalid={!!formik.errors.email}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" value="Reset Password">
            Send Password Reset
          </Button>
        </Form>
        <p className="mt-3">
          <Link to="/login">Back to login</Link>
        </p>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
