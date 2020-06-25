import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import Form from 'react-bootstrap/Form';
import styles from './Editable.module.scss';

function Editable({ children, labelId, multiline, label, editMode, name, inputType }) {
  const [css, setCSS] = useState({});
  const [isEdit, setEdit] = useState(false);
  const tagRef = useRef(null);
  const inputRef = useRef(null);
  const id = labelId || uniqueId('editable');

  useEffect(() => {
    const _styles = window.getComputedStyle(tagRef.current);
    setCSS({ font: _styles.font, textAlign: _styles.textAlign });
  }, []);

  useEffect(() => {
    if (isEdit && editMode) {
      inputRef.current.focus();
    } else if (!editMode && isEdit) {
      setEdit(false);
    }
  }, [isEdit, editMode]);

  function handleEditClick(e) {
    e.preventDefault();
    setEdit(true);
  }

  function handleKeydown(e) {
    if (e.keyCode === 27) {
      setEdit(false);
      return;
    }

    if (e.keyCode === 13 && !multiline) {
      e.preventDefault();
    }
  }

  const {
    type: Tag,
    props: { children: subChildren, ...tagProps },
  } = children;

  /**************************************
   * When content is static, no edit button
   */
  if (!editMode) {
    return (
      <Tag ref={tagRef} {...tagProps}>
        {subChildren}
      </Tag>
    );
  }

  /**************************************
   * Full on edit mode, input visible
   */
  if (isEdit) {
    return (
      <Form.Group controlId={id} onKeyDown={handleKeydown}>
        <Form.Label className="sr-only">{label}</Form.Label>
        {!multiline && (
          <Form.Control
            ref={inputRef}
            style={css}
            type={inputType}
            required
            name={name}
            defaultValue={subChildren}
          />
        )}
        {multiline && (
          <Form.Control
            as="textarea"
            required
            rows="5"
            style={css}
            name={name}
            ref={inputRef}
            defaultValue={subChildren}
          />
        )}
        <Form.Control.Feedback type="invalid">
          This field is required or invalid.
        </Form.Control.Feedback>
      </Form.Group>
    );
  }

  /**************************************
   * Button to turn on edit mode visible
   */
  return (
    <Tag ref={tagRef} style={{ position: 'relative' }} {...tagProps}>
      {subChildren}
      <button
        className={`${styles.btn} ${multiline ? styles.multi : ''}`}
        onClick={handleEditClick}
      >
        <span className="sr-only">edit this field</span>
      </button>
    </Tag>
  );
}

Editable.defaultProps = {
  multiline: false,
  editMode: false,
  inputType: 'text',
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
   * Required: Set the <input name="">
   */
  name: PropTypes.string.isRequired,

  /**
   * [optional] set a label id for accessibility. defaults to an autogenerated id
   */
  labelId: PropTypes.string,

  /**
   * [optional] sets whether input is text or textarea. default: false
   */
  multiline: PropTypes.bool,

  /**
   * [optional] Toggles editing mode. default: false
   */
  editMode: PropTypes.bool,

  /**
   * [optional] Set the <input type="">. default: "text"
   */
  inputType: PropTypes.string,
};

export default Editable;