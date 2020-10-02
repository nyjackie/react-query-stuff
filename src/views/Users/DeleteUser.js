import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import { createSchema, dbID } from 'utils/schema';
import { useDeleteUser } from 'hooks/useUsers';

const schema = createSchema({
  user_id: dbID.required('You must enter a user Id'),
});

function DeleteUser() {
  const [check, setCheck] = useState(false);
  const [deleteUser] = useDeleteUser();

  function finalDelete() {
    deleteUser({ id: formik.values.user_id });
  }

  useEffect(() => {
    if (check) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [check]);

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      user_id: '',
    },
    onSubmit: () => {
      setCheck(true);
    },
  });

  return (
    <>
      <Container className="block shadow-sm">
        <Row>
          <Col>
            <h2>Delete User</h2>
            <h4 className="mt-4">Before you delete...</h4>
            <p>
              Deleting an account will remove all of the information from the database. We will only
              retain the user's data for 30 days and then it will be permanently deleted. A user can
              restore their account at any point within 30 days by contacting us via email.
            </p>
            <p>
              <b>For consumers, </b>cashback will be deactivated when the account is deleted. We
              recommend they cash out all their cashback before you proceed.
            </p>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Form.Group controlId="userID">
                <Form.Label>User ID</Form.Label>

                <Form.Control
                  type="text"
                  name="user_id"
                  autoFocus
                  autoComplete="off"
                  onChange={formik.handleChange}
                  value={formik.values.user_id}
                  isInvalid={formik.touched.user_id && formik.errors.user_id}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.user_id}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="submit" variant="primary">
                Delete
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      {check && (
        <Container className="block shadow-sm">
          <Row>
            <Col>
              <h2 className="mb-4">Are you sure?</h2>
              <Button variant="danger" className="mr-3" onClick={finalDelete}>
                Yes I am sure
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  setCheck(false);
                }}
              >
                Nevermind
              </Button>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default DeleteUser;
