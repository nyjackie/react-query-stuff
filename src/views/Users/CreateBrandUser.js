import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useFormik } from 'formik';
import InputMask from 'react-input-mask';
import { max255, createSchema, phone, password } from 'utils/schema';
import { useUniqueEmail, useUniquePhone } from 'hooks/useAdmin';
import { useBrandForgotPassword } from 'hooks/useBrands';
import { USER_TYPES } from 'utils/constants';
import { useCreateBrandUser } from 'hooks/useUsers';
import SendForgotPassword, { TEMPLATES } from 'views/Users/SendForgotPassword';
import Password from 'components/Password';

const schema = createSchema({
  email: max255.required('This field is required').email('Please enter a valid email'),
  first_name: max255.required('This field is required'),
  last_name: max255.required('This field is required'),
  password: password,
  phone_number: phone.required('This field is required'),
  brand_id: max255.required('This field is required'),
});

function CreateUser() {
  const [postUser, { isLoading, isSuccess, isError, error }] = useCreateBrandUser();
  const [checkUniqueEmail, { isLoading: ueLoading }] = useUniqueEmail();
  const [checkUniquePhone, { isLoading: upLoading }] = useUniquePhone();

  const [isBadEmail, setIsBadEmail] = useState(false);
  const [isBadPhone, setIsBadPhone] = useState(false);

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      phone_number: '',
      brand_id: '',
    },
    onSubmit: values => {
      values.phone_number = values.phone_number.replace(/\D/g, '');

      Promise.all([
        checkUniqueEmail({
          email: values.email,
          user_type: USER_TYPES.BRAND,
        }),
        checkUniquePhone({
          phone_number: values.phone_number,
          user_type: USER_TYPES.BRAND,
        }),
      ]).then(results => {
        const [isUniqueEmail, isUniquePhone] = results;
        setIsBadEmail(!isUniqueEmail);
        setIsBadPhone(!isUniquePhone);
        if (isUniqueEmail && isUniquePhone) {
          postUser(values);
        }
      });
    },
  });

  return (
    <>
      <Container className="block shadow-sm">
        <Row>
          <Col>
            <h2>
              Create new{' '}
              <b>
                <u>Brand</u>
              </b>{' '}
              user
            </h2>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Form.Group controlId="brandID">
                <Form.Label className="sr-only">
                  <b>Brand ID</b>
                </Form.Label>
                <Form.Control
                  placeholder="Brand ID"
                  type="text"
                  name="brand_id"
                  autoFocus
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.brand_id}
                  isValid={formik.touched.brand_id && !formik.errors.brand_id}
                  isInvalid={formik.touched.brand_id && !!formik.errors.brand_id}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.brand_id}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label className="sr-only">
                  <b>Email</b>
                </Form.Label>
                <Form.Control
                  placeholder="Email"
                  type="email"
                  name="email"
                  onChange={e => {
                    setIsBadEmail(false);
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  isInvalid={isBadEmail || (formik.touched.email && formik.errors.email)}
                  isValid={!isBadEmail && formik.touched.email && !formik.errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                  {isBadEmail && `Brand user with email ${formik.values.email} already exists`}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="firstName">
                <Form.Label className="sr-only">
                  <b>First name</b>
                </Form.Label>
                <Form.Control
                  placeholder="First name"
                  type="text"
                  name="first_name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.first_name}
                  isValid={formik.touched.first_name && !formik.errors.first_name}
                  isInvalid={formik.touched.first_name && !!formik.errors.first_name}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.first_name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="lastName">
                <Form.Label className="sr-only">
                  <b>Last name</b>
                </Form.Label>
                <Form.Control
                  placeholder="Last name"
                  type="text"
                  name="last_name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.last_name}
                  isValid={formik.touched.last_name && !formik.errors.last_name}
                  isInvalid={formik.touched.last_name && !!formik.errors.last_name}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.last_name}
                </Form.Control.Feedback>
              </Form.Group>

              <Password
                placeholder="Password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                isValid={formik.touched.password && !formik.errors.password}
                isInvalid={formik.touched.password && !!formik.errors.password}
                error={formik.errors.password}
              />

              <Form.Group controlId="phoneNumber">
                <Form.Label className="sr-only">
                  <b>Phone number</b>
                </Form.Label>
                <Form.Control
                  placeholder="Phone number"
                  type="tel"
                  as={InputMask}
                  mask="(999) 999-9999"
                  name="phone_number"
                  onChange={e => {
                    setIsBadPhone(false);
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone_number}
                  isInvalid={
                    isBadPhone || (formik.touched.phone_number && formik.errors.phone_number)
                  }
                  isValid={
                    !isBadPhone && formik.touched.phone_number && !formik.errors.phone_number
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.phone_number}
                  {isBadPhone && `Brand user with this phone number already exists`}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                disabled={ueLoading || upLoading || isLoading}
              >
                Submit
              </Button>
              {isError && (
                <p className="mt-2 text-danger">{error?.message || 'An internal error occured!'}</p>
              )}
              {isError && error.response.status === 409 && (
                <p className="mt-2 text-danger">
                  A user already exists for this brand ID. Only one user per brand
                </p>
              )}
              {(ueLoading || upLoading || isLoading) && (
                <Spinner as="span" size="md" animation="border" role="status" aria-hidden="true">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}
              {isSuccess && <p className="mt-2 text-success">User successfully created!</p>}
            </Form>
          </Col>
        </Row>
      </Container>
      {isSuccess && (
        <SendForgotPassword
          email={formik.values.email}
          hook={useBrandForgotPassword}
          new_template={TEMPLATES.NEW_BRAND}
        />
      )}
    </>
  );
}

export default CreateUser;
