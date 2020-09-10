import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useFormik } from 'formik';
import { createSchema, password } from 'utils/schema';
import { useChangePassword } from 'hooks/useSettings';
import Password from 'components/Password';
import { useAuthState } from 'contexts/auth-context';

const schema = createSchema({
  password: password,
});

function CreateUser() {
  const { user } = useAuthState();
  const [doChangePassword, { isLoading, isSuccess, isError, error }] = useChangePassword();

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      password: '',
    },
    onSubmit: values => {
      doChangePassword({ id: user.user_id, body: values });
    },
  });

  return (
    <>
      <Container className="block shadow-sm">
        <Row>
          <Col>
            <h2>Your settings</h2>
          </Col>
        </Row>
      </Container>
      <Container className="block shadow-sm">
        <Row>
          <Col>
            <h3>Change your password</h3>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Password
                placeholder="Enter new password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                isValid={formik.touched.password && !formik.errors.password}
                isInvalid={formik.touched.password && !!formik.errors.password}
                error={formik.errors.password}
              />
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
              {isSuccess && <p className="mt-2 text-success">Password successfully updated</p>}
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CreateUser;
