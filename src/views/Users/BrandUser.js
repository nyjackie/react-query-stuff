import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Col, Row, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import InputMask from 'react-input-mask';
import { cn } from 'gdd-components/dist/utils';
import { setNotification } from 'actions/notifications';
import { createSchema, max255, phone } from 'utils/schema';
import { useUpdateBrandUser } from 'hooks/useUsers';
import { useBrandForgotPassword } from 'hooks/useBrands';
import { useUniqueEmail, useUniquePhone } from 'hooks/useAdmin';
import { USER_TYPES } from 'utils/constants';
import { dedupeUser } from 'utils';
import UserFormControls from 'views/Users/UserFormControls';
import styles from './User.module.scss';

const schema = createSchema({
  first_name: max255.required('This field is required'),
  last_name: max255.required('This field is required'),
  email: max255.email('Invalid email format').required('This field is required'),
  phone_number: phone.required('This field is required'),
});

/**
 * @typedef {object} BrandUserProfile
 * @property {number} brand_id Brand ID
 * @property {string} first_name User's first name.
 * @property {string} last_name User's last name.
 * @property {string} email User's email.
 * @property {string} phone_number User's phone number.
 */

/**
 * @param {object} props
 * @param {UserProfile} props.data
 */
function BrandUser({ data, setNotification, includeHeader = true }) {
  const [edit, toggleEdit] = useState(false);
  const [updateUser] = useUpdateBrandUser();
  const [checkUniqueEmail, { data: ueData }] = useUniqueEmail();
  const [checkUniquePhone, { data: upData }] = useUniquePhone();

  const badEmail = typeof ueData === 'boolean' && ueData === false;
  const badPhone = typeof upData === 'boolean' && upData === false;

  function doUpdateUser(changedValues) {
    updateUser({ id: data.user_id, body: changedValues })
      .then(() => {
        setNotification('Saves successful', 'success');
        toggleEdit(false);
      })
      .catch(e => {
        setNotification(e.message, 'danger');
        toggleEdit(false);
      });
  }

  const formik = useFormik({
    initialValues: data,
    validationSchema: schema,
    onSubmit: values => {
      // check if values are different from the data object because we only want
      // to post changed values and ignore ones that did not change
      const changedValues = dedupeUser(data, values);

      if (Object.keys(changedValues).length === 0) {
        // nothing changed
        setNotification('no values changed, nothing to update', 'warning');
        return;
      }

      const uniquePromises = [];
      const promiseOrder = [];

      if (changedValues.email) {
        promiseOrder.push('email');
        uniquePromises.push(
          checkUniqueEmail({
            email: changedValues.email,
            user_type: USER_TYPES.BRAND,
          })
        );
      }
      if (changedValues.phone_number) {
        promiseOrder.push('phone');
        uniquePromises.push(
          checkUniquePhone({
            phone_number: changedValues.phone_number,
            user_type: USER_TYPES.BRAND,
          })
        );
      }

      if (uniquePromises.length > 0) {
        Promise.all(uniquePromises)
          .then(results => {
            results.forEach((r, i) => {
              if (r === false) {
                setNotification(
                  `A brand user with that ${promiseOrder[i]} already exist`,
                  'danger',
                  10000
                );
              }
            });

            if (!results.includes(false)) {
              doUpdateUser(changedValues);
            }
          })
          .catch(err => {
            setNotification(err.message, 'danger');
          });
        return;
      }
      doUpdateUser(changedValues);
    },
  });

  return (
    <>
      <Container className={cn(`block shadow-sm`, styles.userEdit)}>
        {includeHeader && (
          <>
            <Helmet>
              <title>Brand User | Admin Portal | Give Good Deeds</title>
            </Helmet>
            <Row>
              <Col>
                <h2>Brand User Edit</h2>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>
                  <Link to={`/brands/${data.brand_id}`}>
                    <u>Brand id: {data.brand_id}</u>
                  </Link>
                </p>
              </Col>
            </Row>
          </>
        )}
        <Form noValidate onSubmit={formik.handleSubmit} className="mb-2">
          <Form.Group as={Row} controlId="first_name">
            <Form.Label column xl={3}>
              First Name:
            </Form.Label>
            <Col>
              <Form.Control
                disabled={!edit}
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
          </Form.Group>

          <Form.Group as={Row} controlId="last_name">
            <Form.Label column xl={3}>
              Last Name:
            </Form.Label>
            <Col>
              <Form.Control
                disabled={!edit}
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
          </Form.Group>

          <Form.Group as={Row} controlId="email">
            <Form.Label column xl={3}>
              Email:
            </Form.Label>
            <Col>
              <Form.Control
                disabled={!edit}
                type="email"
                name="email"
                value={formik.values.email || ''}
                onChange={formik.handleChange}
                isInvalid={badEmail || (formik.touched.email && formik.errors.email)}
                isValid={!badEmail && formik.touched.email && !formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="phone">
            <Form.Label column xl={3}>
              Phone:
            </Form.Label>
            <Col>
              <Form.Control
                disabled={!edit}
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
          </Form.Group>

          <UserFormControls
            isEdit={edit}
            setEdit={toggleEdit}
            email={data.email}
            useForgotPassword={useBrandForgotPassword}
          />
        </Form>
      </Container>
    </>
  );
}

BrandUser.propTypes = {
  setNotification: PropTypes.func.isRequired,
};

export default connect(null, { setNotification })(BrandUser);
