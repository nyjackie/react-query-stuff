import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useFormik } from 'formik';
import { gddEmailRequired, max255, createSchema } from 'utils/schema';

import { ReactComponent as Logo } from '../assets/good-deeds-logo-teal.svg';
import { login } from 'actions/auth';
import styles from './Login.module.scss';

const schema = createSchema({
  email: gddEmailRequired,
  password: max255.required('Password field is required'),
});

const Login = ({ login, isAuthenticated, location }) => {
  const [loginError, setLoginError] = useState(null);

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
    const lastPage = location?.state?.from?.pathname;
    return <Redirect to={lastPage || '/claims'} />;
  }

  return (
    <Row className="justify-content-md-center">
      <Col md={6} lg={4} className={`${styles.loginPage} block shadow-sm`}>
        <Logo className={styles.logo} aria-hidden="true" />
        <h1 className="sr-only">Give Good Deeds</h1>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Form.Group controlId="email">
            <Form.Label className="sr-only">
              <b>Email</b>
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
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </Col>
    </Row>
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
