import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import AsyncSelect from 'react-select/async';
import InputMask from 'react-input-mask';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { setNotification } from 'actions/notifications';
import { max255, createSchema, phone, password } from 'utils/schema';
import { useUniqueEmail, useUniquePhone } from 'hooks/useAdmin';
import { useBrandForgotPassword } from 'hooks/useBrands';
import { USER_TYPES } from 'utils/constants';
import { useCreateBrandUser } from 'hooks/useUsers';
import SendForgotPassword, { TEMPLATES } from 'views/Users/SendForgotPassword';
import Password from 'components/Password';
import { internalSearchBrands } from 'gdd-api-lib';

const schema = createSchema({
  email: max255.required('This field is required').email('Please enter a valid email'),
  first_name: max255.required('This field is required'),
  last_name: max255.required('This field is required'),
  password: password,
  phone_number: phone.required('This field is required'),
  brand_id: max255.required('This field is required'),
});

const loadOptions = async inputValue => {
  const res = await internalSearchBrands({ search_term: window.btoa(inputValue) });
  const newRes = res.data.brands.map(data => {
    return { value: data.id, label: data.name };
  });
  return newRes;
};

function CreateBrandUser({ setNotification }) {
  const [postUser, { isLoading, isSuccess }] = useCreateBrandUser();
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
    onSubmit: async values => {
      values.phone_number = values.phone_number.replace(/\D/g, '');

      try {
        const isUniquePhone = await checkUniquePhone({
          phone_number: values.phone_number,
          user_type: USER_TYPES.BRAND,
        });
        const isUniqueEmail = await checkUniqueEmail({
          email: values.email,
          user_type: USER_TYPES.BRAND,
        });

        setIsBadEmail(!isUniqueEmail);
        setIsBadPhone(!isUniquePhone);

        if (isUniqueEmail && isUniquePhone) {
          await postUser(values);
          setNotification('User successfully created', 'success');
        }
      } catch (err) {
        if (err.response.status === 409) {
          setNotification(
            'A user already exists for this brand ID. Only one user per brand',
            'error',
            20000 // 20s
          );
          return;
        }
        setNotification(
          `An error occured: ${err.response?.data?.message}`,
          'error',
          20000 // 20s
        );
      }
    },
  });

  /**
   * react-select/AsyncSelect - set error border color to match react-bootstrap
   */
  const customStyles = {
    control: provided => ({
      ...provided,
      borderColor: formik.errors.brand_id ? 'var(--danger)' : provided.borderColor,
    }),
  };

  return (
    <>
      <Helmet>
        <title>Create Brand User | Admin Portal | Give Good Deeds</title>
      </Helmet>
      <Container className="block shadow-sm">
        <Row>
          <Col>
            <h2>
              Create a new{' '}
              <b>
                <u>Brand</u>
              </b>{' '}
              user
            </h2>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Form.Group controlId="brandID">
                <Form.Label className="sr-only">
                  <b>Search and select a brand</b>
                </Form.Label>
                <AsyncSelect
                  styles={customStyles}
                  placeholder="Search and select a brand"
                  name="brand_id"
                  required
                  autoFocus
                  cacheOptions
                  loadOptions={loadOptions}
                  isSearchable={true}
                  isClearable
                  onChange={e => {
                    formik.setFieldValue('brand_id', e?.value || null);
                  }}
                />
                <Form.Control.Feedback
                  type="invalid"
                  className={formik.errors.brand_id ? 'd-block' : ''}
                >
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
              {(ueLoading || upLoading || isLoading) && (
                <Spinner as="span" size="md" animation="border" role="status" aria-hidden="true">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}
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

export default connect(null, { setNotification })(CreateBrandUser);
