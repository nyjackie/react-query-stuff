import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';

const TZHelpText = () => (
  <Form.Text className="text-muted">
    Only use{' '}
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://en.wikipedia.org/wiki/Eastern_Time_Zone"
    >
      Eastern Time Zone
    </a>{' '}
    in this input
  </Form.Text>
);

/**
 * Datetime ET (Easten Time zone)
 *
 * This component is a simple wrapper around react-bootstrap's Form elements but
 * specifically sets the Form Control's type to "datetime-local" and has help
 * text to inform the user that they should only be setting values in Eastern
 * Time
 */
function DateTimeET({ controlId, label = null, feedback = null, ...props }) {
  return (
    <Form.Group controlId={controlId}>
      {label}
      <Form.Control type="datetime-local" {...props} />
      <TZHelpText />
      {feedback}
    </Form.Group>
  );
}

DateTimeET.propTypes = {
  /**
   * The controlId for react-bootstrap's <Form.Group>
   */
  controlId: PropTypes.string,

  /**
   * Please pass a <Form.Label> component with children here
   */
  label: PropTypes.element,

  /**
   * Please pass a <Form.Control.Feedback> component with children here
   */
  feedback: PropTypes.element,
};

export default DateTimeET;
