import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from 'actions/auth';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';
import Spinner from 'components/Spinner';

/// Currently, submit btn does not call api method.

const Login = ({ login, isAuthenticated, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = e => {
    e.preventDefault();
    console.log('Email and Password', email, password);
    login(email, password);
  };

  if (loading) {
    return <Spinner />;
  }

  if (isAuthenticated) {
    //REDIRECTS USER TO DASHBOARD AFTER LOGIN
    return <Redirect to="/claims" />;
  }

  return (
    <Fragment>
      <PageHeader pageTitle="Login Page" />
      <Container>
        <Row>
          <Col md={6}>
            <Form onSubmit={e => onSubmit(e)}>
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
                Login{' '}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});

export default connect(mapStateToProps, { login })(Login);
