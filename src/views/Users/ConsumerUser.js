import React, { useState } from 'react';
import { Button, Col, Row, Jumbotron, Form } from 'react-bootstrap';

import styles from './User.module.scss';
import { useFormik } from 'formik';
import { usePronounIncomeOptions } from 'hooks/useOptions';

/**
 * - @property {number} id User's id
 * - @property {string} first_name User's first name.
 * - @property {string} last_name User's last name.
 * - @property {string} email User's email.
 * - @property {string} phone_number User's phone number.
 * - @property {string} dob User's birthdate (YYYY-MM-DD)
 * - @property {number} pronouns_id Pronoun selection ID
 * - @property {string} zip_code User's zipcode
 * - @property {number} income_range_id Income Range selection ID
 */
// const initialState = {
//   first_name: '',
//   last_name: '',
//   email: '',
//   phone_number: '',
//   dob: '',
//   zip_code: '',
//   pronouns_id: '',
//   income_range_id: '',
// };

function ConsumerUser({ data }) {
  const [edit, toggleEdit] = useState(true);
  // const { isLoading, data: options, error } = usePronounIncomeOptions();

  const formik = useFormik({
    initialValues: data,
    onSubmit: values => {
      console.log(values);
    },
  });

  return (
    <Jumbotron className={styles.jumbotron}>
      <Button
        className={styles.edit}
        onClick={e => {
          e.preventDefault();
          toggleEdit(!edit);
        }}
      >
        Edit
      </Button>
      <Form noValidate onSubmit={formik.onSubmit}>
        <Form.Row>
          <Col xl={6}>
            <Form.Group as={Row} controlId="first_name">
              <Form.Label column xl={3}>
                First Name:
              </Form.Label>
              <Col>
                <Form.Control
                  plaintext={edit}
                  readOnly={edit}
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.onChange}
                />
              </Col>
            </Form.Group>
          </Col>
          <Col xl={6}>
            <Form.Group as={Row} controlId="last_name">
              <Form.Label column xl={3}>
                Last Name:
              </Form.Label>
              <Col>
                <Form.Control
                  plaintext={edit}
                  readOnly={edit}
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.onChange}
                />
              </Col>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col xl={6}>
            <Form.Group as={Row} controlId="email">
              <Form.Label column xl={3}>
                Email:
              </Form.Label>
              <Col>
                <Form.Control
                  plaintext={edit}
                  readOnly={edit}
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.onChange}
                />
              </Col>
            </Form.Group>
          </Col>
          <Col xl={6}>
            <Form.Group as={Row} controlId="phone">
              <Form.Label column xl={3}>
                Phone:
              </Form.Label>
              <Col>
                <Form.Control
                  plaintext={edit}
                  readOnly={edit}
                  type="tel"
                  name="phone_number"
                  value={formik.values.phone_number}
                  onChange={formik.onChange}
                />
              </Col>
            </Form.Group>
          </Col>
          <Col xl={6}>
            <Form.Group as={Row} controlId="dob">
              <Form.Label column xl={3}>
                Date of birth:
              </Form.Label>
              <Col>
                <Form.Control
                  plaintext={edit}
                  readOnly={edit}
                  type="date"
                  name="dob"
                  value={formik.values.dob}
                  onChange={formik.onChange}
                />
              </Col>
            </Form.Group>
          </Col>
          <Col xl={6}>
            <Form.Group as={Row} controlId="zip">
              <Form.Label column xl={3}>
                Zip code:
              </Form.Label>
              <Col>
                <Form.Control
                  plaintext={edit}
                  readOnly={edit}
                  type="text"
                  name="zip_code"
                  value={formik.values.zip_code}
                  onChange={formik.onChange}
                />
              </Col>
            </Form.Group>
          </Col>
          <Col xl={6}>
            <Form.Group as={Row} controlId="pronoun">
              <Form.Label column xl={3}>
                Pronoun:
              </Form.Label>
              <Col>
                <Form.Control
                  plaintext={edit}
                  readOnly={edit}
                  type="text"
                  name="pronouns_id"
                  value={formik.values.pronouns_id}
                  onChange={formik.onChange}
                />
              </Col>
            </Form.Group>
          </Col>
          <Col xl={6}>
            <Form.Group as={Row} controlId="income_range">
              <Form.Label column xl={3}>
                Income range:
              </Form.Label>
              <Col>
                <Form.Control
                  plaintext={edit}
                  readOnly={edit}
                  type="text"
                  name="income_range_id"
                  value={formik.values.income_range_id}
                  onChange={formik.onChange}
                />
              </Col>
            </Form.Group>
          </Col>
        </Form.Row>
      </Form>
    </Jumbotron>
  );
}

export default ConsumerUser;
