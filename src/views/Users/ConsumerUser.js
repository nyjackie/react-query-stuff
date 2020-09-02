import React, { useState } from 'react';
import { Button, Col, Row, Jumbotron, Form, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import { createSchema, max255, phone, zipcode, dob } from 'utils/schema';
import styles from './User.module.scss';
import { usePronounIncomeOptions } from 'hooks/useOptions';
import { useUpdateUser } from 'hooks/useUsers';
import { cn } from 'gdd-components/dist/utils';
import DateInput, { dateFmt } from 'components/DateInput';
import { dedupeObj } from 'utils';

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
function ConsumerUser({ data }) {
  const [edit, toggleEdit] = useState(false);
  const { data: options } = usePronounIncomeOptions();
  const [updateUser, { isSuccess, isError, error }] = useUpdateUser();

  const formik = useFormik({
    initialValues: data,
    validationSchema: schema,
    onSubmit: values => {
      if (values.dob && dateFmt.test(values.dob)) {
        const [m, d, y] = values.dob.split('/');
        values.dob = `${y}-${m.length === 1 ? '0' + m : m}-${d.length === 1 ? '0' + d : d}`;
      }
      if (values.income_range_id === '') values.income_range_id = null;
      if (values.pronouns_id === '') values.pronouns_id = null;

      delete values.id;
      console.log(values);
      updateUser({ id: data.id, body: dedupeObj(data, values) });
    },
  });

  return (
    <Jumbotron className={cn(styles.jumbotron, styles.userEdit)}>
      <Button
        className={styles.edit}
        onClick={e => {
          e.preventDefault();
          toggleEdit(!edit);
        }}
      >
        Edit
      </Button>
      <Form noValidate onSubmit={formik.handleSubmit} className="mb-2">
        <Form.Group as={Row} controlId="first_name">
          <Form.Label column xl={2}>
            First Name:
          </Form.Label>
          <Col>
            <Form.Control
              readOnly={!edit}
              name="first_name"
              value={formik.values.first_name || ''}
              onChange={formik.handleChange}
              isInvalid={formik.touched.first_name && formik.errors.first_name}
              isValid={formik.touched.first_name && !formik.errors.first_name}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="last_name">
          <Form.Label column xl={2}>
            Last Name:
          </Form.Label>
          <Col>
            <Form.Control
              readOnly={!edit}
              name="last_name"
              value={formik.values.last_name || ''}
              onChange={formik.handleChange}
              isInvalid={formik.touched.last_name && formik.errors.last_name}
              isValid={formik.touched.last_name && !formik.errors.last_name}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="email">
          <Form.Label column xl={2}>
            Email:
          </Form.Label>
          <Col>
            <Form.Control
              readOnly={!edit}
              type="email"
              name="email"
              value={formik.values.email || ''}
              onChange={formik.handleChange}
              isInvalid={formik.touched.email && formik.errors.email}
              isValid={formik.touched.email && !formik.errors.email}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="phone">
          <Form.Label column xl={2}>
            Phone:
          </Form.Label>
          <Col>
            <Form.Control
              readOnly={!edit}
              type="tel"
              name="phone_number"
              value={formik.values.phone_number || ''}
              onChange={formik.handleChange}
              isInvalid={formik.touched.phone_number && formik.errors.phone_number}
              isValid={formik.touched.phone_number && !formik.errors.phone_number}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="dob">
          <Form.Label column xl={2}>
            Date of birth:
          </Form.Label>
          <Col>
            <DateInput
              readOnly={!edit}
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
          <Form.Label column xl={2}>
            Zip code:
          </Form.Label>
          <Col>
            <Form.Control
              readOnly={!edit}
              type="text"
              name="zip_code"
              value={formik.values.zip_code || ''}
              onChange={formik.handleChange}
              isInvalid={formik.touched.zip_code && formik.errors.zip_code}
              isValid={formik.touched.zip_code && !formik.errors.zip_code}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="pronoun">
          <Form.Label column xl={2}>
            Pronoun:
          </Form.Label>
          <Col>
            <Form.Control
              readOnly={!edit}
              as="select"
              disabled={!edit}
              name="pronouns_id"
              value={formik.values.pronouns_id || ''}
              onChange={formik.handleChange}
              isInvalid={formik.touched.pronouns_id && formik.errors.pronouns_id}
              isValid={formik.touched.pronouns_id && !formik.errors.pronouns_id}
            >
              <option value="">Select a pronoun options</option>
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
          <Form.Label column xl={2}>
            Income range:
          </Form.Label>
          <Col>
            <Form.Control
              readOnly={!edit}
              as="select"
              name="income_range_id"
              disabled={!edit}
              value={formik.values.income_range_id || ''}
              onChange={formik.handleChange}
              isInvalid={formik.touched.income_range_id && formik.errors.income_range_id}
              isValid={formik.touched.income_range_id && !formik.errors.income_range_id}
            >
              <option value="">Select an income range</option>
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

        {edit && (
          <Button type="submit" variant="success">
            Save
          </Button>
        )}
      </Form>
      {isSuccess && <Alert variant="success">Successfully updated user!</Alert>}
      {isError && <Alert variant="danger">{error.message}</Alert>}
    </Jumbotron>
  );
}

export default ConsumerUser;
