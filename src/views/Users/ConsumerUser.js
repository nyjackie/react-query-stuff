import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Col, Row, Container, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import InputMask from 'react-input-mask';

import { cn } from 'gdd-components/dist/utils';

import DateInput from 'components/DateInput';
import { addNotification } from 'actions/notifications';
import { usePronounIncomeOptions } from 'hooks/useOptions';
import { useUpdateConsumerUser } from 'hooks/useUsers';
import { useUniqueEmail, useUniquePhone } from 'hooks/useAdmin';
import { createSchema, max255, phone, zipcode, dob } from 'utils/schema';
import { USER_TYPES } from 'utils/constants';
import { dedupeUser } from 'utils';
import styles from './User.module.scss';

const schema = createSchema({
  first_name: max255.required('This field is required'),
  last_name: max255.required('This field is required'),
  email: max255.email('Invalid email format').required('This field is required'),
  phone_number: phone.required('This field is required'),
  dob,
  zip_code: zipcode,
});

/**
 * @typedef {object} UserProfile
 * @property {number} id User's id
 * @property {string} first_name User's first name.
 * @property {string} last_name User's last name.
 * @property {string} email User's email.
 * @property {string} phone_number User's phone number.
 * @property {string} dob User's birthdate (YYYY-MM-DD)
 * @property {number} pronouns_id Pronoun selection ID
 * @property {string} zip_code User's zipcode
 * @property {number} income_range_id Income Range selection ID
 */

/**
 * @param {object} props
 * @param {UserProfile} props.data
 */
function ConsumerUser({ data, addNotification }) {
  const [edit, toggleEdit] = useState(false);
  const { data: options } = usePronounIncomeOptions();
  const [updateUser] = useUpdateConsumerUser();
  const [checkUniqueEmail, { data: ueData }] = useUniqueEmail();
  const [checkUniquePhone, { data: upData }] = useUniquePhone();

  const badEmail = typeof ueData === 'boolean' && ueData === false;
  const badPhone = typeof upData === 'boolean' && upData === false;

  function doUpdateUser(changedValues) {
    updateUser({ id: data.id, body: changedValues })
      .then(() => {
        addNotification('Saves successful', 'success');
        toggleEdit(false);
      })
      .catch(e => {
        addNotification(e.message, 'danger');
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
        addNotification('no values changed, nothing to update', 'warning');
        return;
      }

      const uniquePromises = [];
      const promiseOrder = [];

      if (changedValues.email) {
        promiseOrder.push('email');
        uniquePromises.push(
          checkUniqueEmail({
            email: changedValues.email,
            user_type: USER_TYPES.CONSUMER,
          })
        );
      }
      if (changedValues.phone_number) {
        promiseOrder.push('phone');
        uniquePromises.push(
          checkUniquePhone({
            phone_number: changedValues.phone_number,
            user_type: USER_TYPES.CONSUMER,
          })
        );
      }

      if (uniquePromises.length > 0) {
        Promise.all(uniquePromises)
          .then(results => {
            results.forEach((r, i) => {
              if (r === false) {
                addNotification(
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
            addNotification(err.message, 'danger');
          });
        return;
      }
      doUpdateUser(changedValues);
    },
  });

  return (
    <Container className={cn(`block shadow-sm`, styles.userEdit)}>
      <Helmet>
        <title>Consumer User | Admin Portal | Give Good Deeds</title>
      </Helmet>
      <Row>
        <Col>
          <h2>Consumer Profile edit</h2>
        </Col>
      </Row>
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
            <Form.Control.Feedback type="invalid">{formik.errors.first_name}</Form.Control.Feedback>
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
            <Form.Control.Feedback type="invalid">{formik.errors.last_name}</Form.Control.Feedback>
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

        <Form.Group as={Row} controlId="dob">
          <Form.Label column xl={3}>
            Date of birth:
          </Form.Label>
          <Col>
            <DateInput
              disabled={!edit}
              name="dob"
              value={formik.values.dob || ''}
              onChange={formik.handleChange}
              isInvalid={formik.touched.dob && formik.errors.dob}
              isValid={formik.touched.dob && !formik.errors.dob}
              errorMsg={formik.errors.dob}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="zip">
          <Form.Label column xl={3}>
            Zip code:
          </Form.Label>
          <Col>
            <Form.Control
              disabled={!edit}
              type="text"
              name="zip_code"
              value={formik.values.zip_code || ''}
              onChange={formik.handleChange}
              isInvalid={formik.touched.zip_code && formik.errors.zip_code}
              isValid={formik.touched.zip_code && !formik.errors.zip_code}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.zip_code}</Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="pronoun">
          <Form.Label column xl={3}>
            Pronoun:
          </Form.Label>
          <Col>
            <Form.Control
              disabled={!edit}
              as="select"
              name="pronouns_id"
              value={formik.values.pronouns_id || ''}
              onChange={formik.handleChange}
              isInvalid={formik.touched.pronouns_id && formik.errors.pronouns_id}
              isValid={formik.touched.pronouns_id && !formik.errors.pronouns_id}
            >
              <option hidden>Pronoun not set</option>
              {options &&
                options.pronoun_options.map(opt => {
                  return (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  );
                })}
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="income_range">
          <Form.Label column xl={3}>
            Income range:
          </Form.Label>
          <Col>
            <Form.Control
              disabled={!edit}
              as="select"
              name="income_range_id"
              value={formik.values.income_range_id || ''}
              onChange={formik.handleChange}
              isInvalid={formik.touched.income_range_id && formik.errors.income_range_id}
              isValid={formik.touched.income_range_id && !formik.errors.income_range_id}
            >
              {/* we only show the empty option if the initial data was null  */}
              {options && !options.income_range_options && (
                <option value="">Select an income range</option>
              )}
              {options &&
                options.income_range_options.map(opt => {
                  return (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  );
                })}
            </Form.Control>
          </Col>
        </Form.Group>

        {edit ? (
          <>
            <Button
              variant="outline-primary mr-2"
              onClick={e => {
                e.preventDefault();
                toggleEdit(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="success">
              Save
            </Button>
          </>
        ) : (
          <Button
            className={styles.edit}
            onClick={e => {
              e.preventDefault();
              toggleEdit(true);
            }}
          >
            Edit
          </Button>
        )}
      </Form>
      {/* {isSuccess && <Alert variant="success">Successfully updated user!</Alert>}
      {isError && <Alert variant="danger">{error.message}</Alert>} */}
    </Container>
  );
}

ConsumerUser.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default connect(null, { addNotification })(ConsumerUser);
