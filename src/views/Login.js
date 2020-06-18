import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from 'actions/auth';
import { Form, Button, Row, Col } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';

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
    //REDIRECTS USER TO DASHBOARD AFTER LOGIN
    return <Redirect to="/claims" />;
  }

  return (
    <Fragment>
      <PageHeader pageTitle="Login Page" />
      <Row>
        <Col md={6}>
          <Form onSubmit={onSubmit}>
            <Form.Group controlId="loginEmail">
              <Form.Label className="email">
                <b>Email</b>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Email Address"
                name="email"
                onChange={e => onChange(e)}
                value={email}
                required
              />
            </Form.Group>
            <Form.Group controlId="loginPassword">
              <Form.Label className="password">
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
            <Button type="submit" value="Login">
              Login
            </Button>
            {loginError && <p className="mt-2 text-danger">{loginError}</p>}
          </Form>
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
