import React from 'react';
import { ButtonGroup, Button, Form } from 'react-bootstrap';
import styles from './User.module.scss';
import SendForgotPasswordButton from './SendForgotPasswordButton';

export default ({ isEdit, setEdit, email, useForgotPassword }) => {

  return (
    <Form.Group className={styles.userEditControls}>
      {isEdit ? (
        <>
          <div>
            <Button
              variant="outline-primary mr-2"
              className={styles.edit}
              onClick={e => {
                e.preventDefault();
                setEdit(false);
              }}
            >
              Cancel
            </Button>
            <Button className={styles.edit} type="submit" variant="success">
              Save
            </Button>
          </div>
          <Button className={styles.edit}>
            Send Forgot Password
          </Button>
        </>
      ) : (
        <>
          <div>
            <Button
              className={styles.edit}
              onClick={e => {
                e.preventDefault();
                setEdit(true);
              }}
            >
              Edit
            </Button>
          </div>
          <SendForgotPasswordButton email={email} useForgotPassword={useForgotPassword}>
            Send Forgot Password
          </SendForgotPasswordButton>
        </>
      )}

    </Form.Group>
  )
} 
