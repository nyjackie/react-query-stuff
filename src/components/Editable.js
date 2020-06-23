import React, { useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import Form from 'react-bootstrap/Form';

function Editable({ children, labelId, multiline, label, editing, name }) {
  const [font, setFont] = useState(null);
  const tagRef = useRef(null);
  const id = labelId || uniqueId('editable');

  useLayoutEffect(() => {
    const _styles = window.getComputedStyle(tagRef.current);
    setFont(_styles.font);
  }, []);

  const { type: Tag, props: tagProps } = children;

  if (editing) {
    return (
      <Form.Group controlId={id}>
        <Form.Label className="sr-only">{label}</Form.Label>
        {!multiline && (
          <Form.Control
            style={{ font }}
            type="text"
            required
            name={name}
            defaultValue={tagProps.children}
          />
        )}
        {multiline && (
          <Form.Control
            as="textarea"
            required
            rows="5"
            style={{ font }}
            name={name}
            defaultValue={tagProps.children}
          />
        )}
        <Form.Control.Feedback type="invalid">This field is required.</Form.Control.Feedback>
      </Form.Group>
    );
  }

  return <Tag ref={tagRef} {...tagProps} />;
}

Editable.defaultProps = {
  multiline: false,
  editMode: false,
};

Editable.propTypes = {
  /**
   * Required: This component should only ever have 1 child
   */
  children: PropTypes.object.isRequired,

  /**
   * Required: Set descriptive label text for accessibility
   */
  label: PropTypes.string.isRequired,

  /**
   * the name of the state property being edit, will be used for the input.name
   */
  name: PropTypes.string.isRequired,

  /**
   * [optional] set a label id for accessibility. defaults to an autogenerated id
   */
  labelId: PropTypes.string,

  /**
   * [optional] sets contentedtiable multiline. default: false
   */
  multiline: PropTypes.bool,

  /**
   * [optional] Toggles editing mode. default: false
   */
  editing: PropTypes.bool,
};

export default Editable;
