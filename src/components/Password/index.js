import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { specialRegex } from 'utils/schema';
import { cn } from 'gdd-components/dist/utils';
import styles from './Password.module.scss';

function Password({ value, error, ...props }) {
  const [showPW, setShowPW] = useState(false);
  return (
    <>
      <InputGroup>
        <Form.Control type={showPW ? 'text' : 'password'} value={value} {...props} />
        <InputGroup.Append>
          <Button
            onClick={e => {
              e.preventDefault();
              setShowPW(!showPW);
            }}
            variant={showPW ? 'secondary' : 'outline-primary'}
          >
            <i className={cn(styles.icon, showPW ? 'fa fa-eye' : 'fa fa-eye-slash')} />
          </Button>
        </InputGroup.Append>
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </InputGroup>

      <ul className={styles.passwordValid}>
        <li className={cn(value.length >= 8 && styles.pass)}>8+ characters</li>
        <li className={cn(/[A-Z]+/.test(value) && /[a-z]+/.test(value) && styles.pass)}>
          Uppercase &amp; lowercase letters
        </li>
        <li className={cn(/[0-9]+/.test(value) && styles.pass)}>Numbers</li>
        <li className={cn(specialRegex.test(value) && styles.pass)}>
          Special characters (@$!%*?&amp;...)
        </li>
      </ul>
    </>
  );
}

export default Password;
