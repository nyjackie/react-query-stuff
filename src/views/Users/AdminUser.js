import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Col, Row, Container, Form } from 'react-bootstrap';
import { useFormik } from 'formik';

// hooks
import { useAdminForgotPassword } from 'hooks/useAdmin';

// redux actions
import { addNotification } from 'actions/notifications';

// utils
import { cn } from 'gdd-components/dist/utils';
import { createSchema, max255 } from 'utils/schema';

// components
import SendForgotPasswordButton from 'views/Users/SendForgotPasswordButton';

// styles
import styles from './User.module.scss';

const schema = createSchema({
  email: max255.email('Invalid email format').required('This field is required'),
});

function AdminUser({ data = { email: '' }, addNotification, includeHeader = true }) {
  const formik = useFormik({
    initialValues: data,
    validationSchema: schema,
  });

  return (
    <Container className={cn(`block shadow-sm`, styles.userEdit)}>
      {includeHeader && (
        <>
          <Helmet>
            <title>Internal User | Admin Portal | Give Good Deeds</title>
          </Helmet>
          <Row>
            <Col>
              <h2>Admin (aka Internal) User Edit</h2>
              <p>
                Currently unavailable until the following API is ready:{' '}
                <code>GET /user/internal/{`user_id`}/profile</code>{' '}
              </p>
              <p>Enter an email below to initiate a forgot password for that user</p>
            </Col>
          </Row>
        </>
      )}
      <Form noValidate onSubmit={formik.handleSubmit} className="mb-2">
        <Form.Group as={Row} controlId="email">
          <Form.Label column xl={3}>
            Email:
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="email"
              name="email"
              value={formik.values.email || ''}
              onChange={formik.handleChange}
              className={styles.edit}
              isInvalid={formik.touched.email && formik.errors.email}
              isValid={formik.touched.email && !formik.errors.email}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
          </Col>
          <Col sm={4}>
            <SendForgotPasswordButton
              style={{ width: '100%' }}
              email={formik.values.email}
              useForgotPassword={useAdminForgotPassword}
            />
          </Col>
        </Form.Group>
      </Form>
    </Container>
  );
}

AdminUser.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default connect(null, { addNotification })(AdminUser);
