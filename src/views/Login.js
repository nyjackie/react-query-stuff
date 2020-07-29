import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import { object as yupObject, string as yupString } from 'yup';

import { ReactComponent as Logo } from '../assets/good-deeds-logo-teal.svg';
import { login } from 'actions/auth';
import styles from './Login.module.scss';

const emailMsg = 'Please enter a @gooddeedsdata.com email';
const schema = yupObject({
  email: yupString()
    .trim()
    // not sure if this is needed but it's good practice to limit input length
    .max(250, 'email is too long (max: 250)')
    .email(emailMsg)
    .matches(/@gooddeedsdata.com$/, emailMsg)
    .required(emailMsg),
  password: yupString()
    .max(250, 'password is too long (max: 250)')
    .required('Password field is required'),
});

const Login = ({ login, isAuthenticated }) => {
  const [loginError, setLoginError] = useState(null);

  // Pass the useFormik() hook initial form values and a submit function that will
  // be called when the form is submitted
  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: values => {
      login(values.email, values.password).catch(err => {
        setLoginError(err.message);
      });
    },
  });

  if (isAuthenticated) {
    // For now /claims is the default logged in home page after logging in
    // this might change in the future
    return <Redirect to="/claims" />;
  }

  return (
    <Fragment>
      <Row className="justify-content-md-center">
        <Col md={4} className={styles.loginPage}>
          <Logo className={styles.logo} aria-hidden="true" />
          <h1 className="sr-only">Good Deeds Data admin portal</h1>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label className="sr-only">
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
            <Form.Group controlId="password">
              <Form.Label className="sr-only">
                <b>Password</b>
              </Form.Label>
              <Form.Control
                placeholder="Password"
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                isInvalid={formik.touched.password && !!formik.errors.password}
                isValid={formik.touched.password && !formik.errors.password}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="primary" block>
              Login
            </Button>
            {loginError && <p className="mt-2 text-danger">{loginError}</p>}
          </Form>
          <p className="mt-3">
            <Link to="/reset-password">Forgot Password?</Link>
          </p>
        </Col>
      </Row>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
