import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { register } from '../../actions/auth';
import PageHeader from '../PageHeader';

/// Currently, submit btn does not call api method.

const Register = ({ register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });

  const { email, password, password2, first_name, last_name } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      //Alert user that pasword doesn't match
      alert('password doesnt match');
      console.log(email, password, password2);
    } else {
      console.log('email and passworld, name', email, password, first_name, last_name);

      // replace consolelog with below code later
      // register({ email, password, first_name, last_name });
    }
  };

  if (isAuthenticated) {
    //REDIRECTS USER TO DASHBOARD AFTER REGISTER
    return <Redirect to="/dashboard" />;
  }

  return (
    <Fragment>
      <PageHeader pageTitle="Register Page" />
      <Container>
        <Form className="form" onSubmit={e => onSubmit(e)}>
          <Form.Group controlId="email">
            <Form.Label className="email">
              <b>Email</b>
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={e => onChange(e)}
              required
            />
          </Form.Group>

          <Form.Group controlId="firstName">
            <Form.Label className="first_name">
              <b>First name</b>
            </Form.Label>
            <Form.Control
              type="string"
              placeholder="First Name"
              name="first_name"
              value={first_name}
              onChange={e => onChange(e)}
              required
            />
          </Form.Group>

          <Form.Group controlId="lastName">
            <Form.Label className="last_name">
              <b>Last Name</b>
            </Form.Label>
            <Form.Control
              type="string"
              placeholder="Last Name"
              name="last_name"
              value={last_name}
              onChange={e => onChange(e)}
              required
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label className="password">
              <b>Password</b>
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={e => onChange(e)}
              required
              minLength="6"
            />
          </Form.Group>

          <Form.Group controlId="password2">
            <Form.Label className="password2">
              <b>Re-enter password</b>
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter password"
              name="password2"
              value={password2}
              onChange={e => onChange(e)}
              required
              minLength="6"
            />
          </Form.Group>

          <Button type="submit" value="Register">
            Register
          </Button>
        </Form>
      </Container>
    </Fragment>
  );
};

Register.propTypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(Register);
