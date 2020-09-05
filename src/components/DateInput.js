import React, { useState } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import InputMask from 'react-input-mask';

/**
 * This component handles fallbacks for browsers that do not support
 * <input type="date"> like Safari
 */

// MM-DD-YYYY
// MM/DD/YYYY
const MM = '(0?[1-9]|1[0-2])'; // 1|01 - 12
const DD = '(0?[1-9]|1[0-9]|2[0-9]|3[0-1])'; // 1|01 - 31
const YY = '(19[0-9]\\d|20[01]\\d)'; // 1900 - 2019
export const dateFmt = new RegExp(`^${MM}[-/]${DD}[-/]${YY}$`);

/**
 * convert the dates returned by our servers YYYY-MM-DD to MM/DD/YYYY
 * @param {string} inputDate
 */
function format(inputDate) {
  if (/^\d{4}-/.test(inputDate)) {
    const [y, m, d] = inputDate.split('-');
    return `${m}/${d}/${y}`;
  }
  return inputDate;
}

const test = document.createElement('input');
try {
  test.type = 'date';
} catch (e) {}

function CustomDateInput({ type, onChange, value, ...props }) {
  const [invalid, setInvalid] = useState(false);

  function handleChange(e) {
    const val = e.target.value;
    if (val.length > 0 && !dateFmt.test(val)) {
      setInvalid(true);
    } else {
      setInvalid(false);
    }
    onChange(e);
  }

  return (
    <>
      <Form.Control
        type="date"
        as={InputMask}
        mask="99/99/9999"
        placeholder="mm/dd/yyyy"
        {...props}
        onChange={handleChange}
        value={format(value)}
        isInvalid={invalid}
      />
      <FormControl.Feedback type="invalid">
        Must be a valid date in MM/DD/YYYY format
      </FormControl.Feedback>
    </>
  );
}

function DateInput({ type, onChange, value, errorMsg, isInvalid, ...props }) {
  if (test.type === 'text') {
    return <CustomDateInput {...props} onChange={onChange} value={value} />;
  }

  return (
    <>
      <Form.Control
        type="date"
        {...props}
        onChange={onChange}
        isInvalid={isInvalid}
        value={value}
      />
      <FormControl.Feedback type="invalid">{errorMsg}</FormControl.Feedback>
    </>
  );
}

export default DateInput;
