import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useFormik } from 'formik';
import { createSchema, password } from 'utils/schema';
import { useChangePassword } from 'hooks/useSettings';
import { addNotification } from 'actions/notifications';
import Password from 'components/Password';

const schema = createSchema({
  password: password,
});

function Settings({ user, addNotification }) {
  const [doChangePassword, { isLoading }] = useChangePassword();

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      password: '',
    },
    onSubmit: async values => {
      try {
        await doChangePassword({ id: user.user_id, body: values });
        addNotification('Password successfully updated', 'success');
      } catch (err) {
        addNotification(`Error: ${err.response?.data?.message}`, 'error');
      }
    },
  });

  return (
    <Container>
      <Helmet>
        <title>Settings | Admin Portal | Give Good Deeds</title>
      </Helmet>
      <Row>
        <Col md={8}>
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
                  {isLoading && (
                    <Spinner
                      as="span"
                      size="md"
                      animation="border"
                      role="status"
                      aria-hidden="true"
                    >
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  )}
                </Form>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { addNotification })(Settings);
