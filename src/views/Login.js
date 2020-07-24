import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';

import { ReactComponent as Logo } from '../assets/good-deeds-logo-teal.svg';
import { login } from 'actions/auth';
import styles from './Login.module.scss';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loginError, setLoginError] = useState(null);
  const { email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = e => {
    e.preventDefault();
    setLoginError(null); // clear error
    login(email, password).catch(err => {
      // console.error(err)
      setLoginError(err.message);
    });
  };

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
          <Form onSubmit={onSubmit}>
            <Form.Group controlId="loginEmail">
              <Form.Label className="sr-only">
                <b>Email</b>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                onChange={e => onChange(e)}
                value={email}
                required
              />
            </Form.Group>
            <Form.Group controlId="loginPassword">
              <Form.Label className="sr-only">
                <b>Password</b>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={e => onChange(e)}
                value={password}
                required
              />
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
