import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Col, Row, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import InputMask from 'react-input-mask';

// hooks
import { useAdminForgotPassword } from 'hooks/useAdmin';
// import { useUniqueEmail, useUniquePhone } from 'hooks/useAdmin';

// redux actions
import { addNotification } from 'actions/notifications';

// utils
import { cn } from 'gdd-components/dist/utils';
import { createSchema, max255, phone } from 'utils/schema';
import { USER_TYPES } from 'utils/constants';
import { dedupeUser } from 'utils';

// components
import SendForgotPassword from 'views/Users/SendForgotPassword';

// styles
import styles from './User.module.scss';

const schema = createSchema({
  // first_name: max255.required('This field is required'),
  // last_name: max255.required('This field is required'),
  email: max255.email('Invalid email format').required('This field is required'),
  // phone_number: phone.required('This field is required'),
});

function AdminUser({ data = { email: '' }, addNotification }) {
  // const [updateUser] = useUpdateBrandUser();
  // const [checkUniqueEmail, { data: ueData }] = useUniqueEmail();
  // const [checkUniquePhone, { data: upData }] = useUniquePhone();

  // const badEmail = typeof ueData === 'boolean' && ueData === false;
  // const badPhone = typeof upData === 'boolean' && upData === false;

  // function doUpdateUser(changedValues) {
  //   updateUser({ id: data.user_id, body: changedValues })
  //     .then(() => {
  //       addNotification('Saves successful', 'success');
  //       toggleEdit(false);
  //     })
  //     .catch(e => {
  //       addNotification(e.message, 'danger');
  //       toggleEdit(false);
  //     });
  // }

  const formik = useFormik({
    initialValues: data,
    validationSchema: schema,
    // onSubmit: values => {
    //   // check if values are different from the data object because we only want
    //   // to post changed values and ignore ones that did not change
    //   const changedValues = dedupeUser(data, values);

    //   if (Object.keys(changedValues).length === 0) {
    //     // nothing changed
    //     addNotification('no values changed, nothing to update', 'warning');
    //     return;
    //   }

    //   const uniquePromises = [];
    //   const promiseOrder = [];

    //   if (changedValues.email) {
    //     promiseOrder.push('email');
    //     uniquePromises.push(
    //       checkUniqueEmail({
    //         email: changedValues.email,
    //         user_type: USER_TYPES.BRAND,
    //       })
    //     );
    //   }
    //   if (changedValues.phone_number) {
    //     promiseOrder.push('phone');
    //     uniquePromises.push(
    //       checkUniquePhone({
    //         phone_number: changedValues.phone_number,
    //         user_type: USER_TYPES.BRAND,
    //       })
    //     );
    //   }

    //   if (uniquePromises.length > 0) {
    //     Promise.all(uniquePromises)
    //       .then(results => {
    //         results.forEach((r, i) => {
    //           if (r === false) {
    //             addNotification(
    //               `A brand user with that ${promiseOrder[i]} already exist`,
    //               'danger',
    //               10000
    //             );
    //           }
    //         });

    //         if (!results.includes(false)) {
    //           doUpdateUser(changedValues);
    //         }
    //       })
    //       .catch(err => {
    //         addNotification(err.message, 'danger');
    //       });
    //     return;
    //   }
    //   doUpdateUser(changedValues);
    // },
  });

  return (
    <>
      <Helmet>
        <title>Internal User | Admin Portal | Give Good Deeds</title>
      </Helmet>
      <Container className={cn(`block shadow-sm`, styles.userEdit)}>
        <Row>
          <Col>
            <h2>Admin Profile edit</h2>
            <p>
              Currently unavailable until the following API is ready:{' '}
              <code>GET /user/internal/{`user_id`}/profile</code>{' '}
            </p>
            <p>Enter an email below to initiate a forgot password for that user</p>
          </Col>
        </Row>
        <Form noValidate onSubmit={formik.handleSubmit} className="mb-2">
          {/* <Form.Group as={Row} controlId="first_name">
            <Form.Label column xl={3}>
              First Name:
            </Form.Label>
            <Col>
              <Form.Control
                name="first_name"
                value={formik.values.first_name || ''}
                onChange={formik.handleChange}
                isInvalid={formik.touched.first_name && formik.errors.first_name}
                isValid={formik.touched.first_name && !formik.errors.first_name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.first_name}
              </Form.Control.Feedback>
            </Col>
          </Form.Group> */}

          {/* <Form.Group as={Row} controlId="last_name">
            <Form.Label column xl={3}>
              Last Name:
            </Form.Label>
            <Col>
              <Form.Control
                name="last_name"
                value={formik.values.last_name || ''}
                onChange={formik.handleChange}
                isInvalid={formik.touched.last_name && formik.errors.last_name}
                isValid={formik.touched.last_name && !formik.errors.last_name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.last_name}
              </Form.Control.Feedback>
            </Col>
          </Form.Group> */}

          <Form.Group as={Row} controlId="email">
            <Form.Label column xl={3}>
              Email:
            </Form.Label>
            <Col>
              <Form.Control
                type="email"
                name="email"
                value={formik.values.email || ''}
                onChange={formik.handleChange}
                // isInvalid={badEmail || (formik.touched.email && formik.errors.email)}
                // isValid={!badEmail && formik.touched.email && !formik.errors.email}
                isInvalid={formik.touched.email && formik.errors.email}
                isValid={formik.touched.email && !formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          {/* <Form.Group as={Row} controlId="phone">
            <Form.Label column xl={3}>
              Phone:
            </Form.Label>
            <Col>
              <Form.Control
                type="tel"
                as={InputMask}
                mask="(999) 999-9999"
                name="phone_number"
                value={formik.values.phone_number.replace(/^\+1/, '') || ''}
                onChange={formik.handleChange}
                isInvalid={badPhone || (formik.touched.phone_number && formik.errors.phone_number)}
                isValid={!badPhone && formik.touched.phone_number && !formik.errors.phone_number}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.phone_number}
              </Form.Control.Feedback>
            </Col>
          </Form.Group> */}

          {/* <Button type="submit" variant="success">
            Save
          </Button> */}
        </Form>
      </Container>
      <SendForgotPassword email={formik.values.email} hook={useAdminForgotPassword} />
    </>
  );
}

AdminUser.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default connect(null, { addNotification })(AdminUser);