import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useFormik } from 'formik';
import { max255, gddEmailRequired, createSchema, phone, password } from 'utils/schema';
import { useCreateUser } from 'hooks/useAdmin';
import Password from 'components/Password';

const schema = createSchema({
  email: gddEmailRequired,
  first_name: max255.required('This field is required'),
  last_name: max255.required('This field is required'),
  password: password,
  phone_number: phone.required('This field is required'),
});

function CreateUser() {
  const [postUser, { isLoading, isSuccess, isError, error }] = useCreateUser();

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      phone_number: '',
    },
    onSubmit: values => {
      postUser(values);
    },
  });

  return (
    <Container className="block shadow-sm">
      <Row>
        <Col>
          <h2>Create new admin user</h2>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label className="sr-only">
                <b>Email</b>
              </Form.Label>
              <Form.Control
                placeholder="Email"
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                isValid={formik.touched.email && !formik.errors.email}
                isInvalid={formik.touched.email && !!formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="firstName">
              <Form.Label className="sr-only">
                <b>First name</b>
              </Form.Label>
              <Form.Control
                placeholder="First name"
                type="first_name"
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
                type="last_name"
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
                type="phone_number"
                name="phone_number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone_number}
                isValid={formik.touched.phone_number && !formik.errors.phone_number}
                isInvalid={formik.touched.phone_number && !!formik.errors.phone_number}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.phone_number}
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary">
              Submit
            </Button>
            {isError && (
              <p className="mt-2 text-danger">{error?.message || 'An internal error occured!'}</p>
            )}
            {isLoading && (
              <Spinner as="span" size="md" animation="border" role="status" aria-hidden="true">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
            {isSuccess && <p className="mt-2 text-success">User successfully created!</p>}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateUser;
