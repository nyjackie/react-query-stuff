// external libs
import React, { useState, useRef } from 'react';
import merge from 'lodash/merge';
import { Col, Row, Button, Form, Alert } from 'react-bootstrap';

// styles
import 'gdd-components/dist/styles/shared.scss';
import styles from './NonProfitInfo.module.scss';

// GDD Components
import { UploadableImg, Tooltip, InputSwap, Share, Combobox } from 'gdd-components';

// our utils
import { serialize } from 'utils';

export default function Profile({ data, onSave }) {
  const [editing, setEditing] = useState(false);
  const [validated, setValidated] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const formRef = useRef(null);

  function toggleEdit(e) {
    e.preventDefault();
    setEditing(!editing);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      console.log('validation failed');
    } else {
      const obj = serialize(formRef.current, false);
      console.log(obj);
      const newData = merge({}, data, obj);
      onSave(newData)
        .then(() => {
          setEditing(false);
          setSaveError(null);
        })
        .catch(err => {
          setSaveError(err.message);
        });
    }
    setValidated(true);
  }

  return (
    <Form
      encType="multipart/form-data"
      noValidate
      validated={validated}
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <input type="hidden" defaultValue={data.ein} name="ein" />

      <article className={styles['np-profile']}>
        <div className="d-flex flex-row justify-content-between align-items-end mt-3">
          <h3 className="m-0">
            Profile{' '}
            <Tooltip>
              <Tooltip.Content id="profile-info">
                <p>
                  <b>How can I update my organization's profile information?</b>
                </p>
                <p>
                  It is a long established fact that a reader will be distracted by the readable
                  content of a page when looking at its layout
                </p>
                <p>
                  <b>How can I update my organization's profile information?</b>
                </p>
                <p>
                  It is a long established fact that a reader will be distracted by the readable
                  content of a page when looking at its layout
                </p>
                <p>
                  <b>How can I update my organization's profile information?</b>
                </p>
                <p>
                  It is a long established fact that a reader will be distracted by the readable
                  content of a page when looking at its layout
                </p>
              </Tooltip.Content>
            </Tooltip>
          </h3>
          <div className="controls">
            <Button onClick={toggleEdit} variant={editing ? 'danger' : 'primary'}>
              {editing ? 'Discard' : 'Edit'}
            </Button>
            {editing && (
              <Button type="submit" variant="success" className="ml-3">
                Publish
              </Button>
            )}
          </div>
        </div>

        {editing && saveError && (
          <Row>
            <Col>
              <Alert variant="danger">{saveError}</Alert>
            </Col>
          </Row>
        )}
        <hr className="mb-5" />
        <header className={styles.header}>
          <InputSwap className="mb-5" label="Name" editMode={editing} name="name">
            <h2 className="mb-5">{data.name}</h2>
          </InputSwap>
          <InputSwap label="Organization type" editMode={editing} name="ntee_code">
            <p>{data.ntee_code}</p>
          </InputSwap>
        </header>

        <section>
          <Row className="mb-4">
            <Col>
              <h3>Nonprofit's Logo and Profile Header Image</h3>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <UploadableImg
                editMode={editing}
                uploadText="Upload Organization Logo"
                className={styles.logoImg}
                src={data.logo_url}
                alt="logo"
                name="logo_url"
                helpText="Photo should be square"
                maxSize={1000}
                minWidth={1000}
                minHeight={1000}
              />
            </Col>
            <Col>
              <UploadableImg
                editMode={editing}
                uploadText="Upload Profile Header Image"
                helpText="Recommended dimensions 2000 x 300"
                className={styles.coverImg}
                src={data.hero_url}
                alt="cover photo"
                name="hero_url"
                maxSize={3000}
                minWidth={2000}
                minHeight={2000}
              />
            </Col>
          </Row>
        </section>
        <section>
          <Row>
            <Col>
              <h3>Mission</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <InputSwap
                hideLabel
                label="Mission statement"
                multiline
                editMode={editing}
                name="mission"
              >
                <p>{data.mission}</p>
              </InputSwap>
            </Col>
          </Row>
        </section>
        <section>
          <Row>
            <Col>
              <h3 className="d-inline-block mr-4">Website</h3>
              <Share url={data.website_url} />
            </Col>
          </Row>
          <Row>
            <Col>
              <InputSwap
                hideLabel
                label="Website url"
                editMode={editing}
                name="website_url"
                inputType="url"
              >
                <a href={data.website_url} target="_blank" rel="noopener noreferrer">
                  {data.website_url}
                </a>
              </InputSwap>
            </Col>
          </Row>
        </section>
        <section>
          <Row>
            <Col>
              <h3>Location</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              {editing ? (
              <Combobox
                label="Location"
                clearOnBlur
                autoSelect
                hideLabel
                value={`${data.address.city}, ${data.address.state}`}
                onSearch={searchString => {
                  return ["New York, NY", "Chicago, IL", "Dallas, TX", "Miami, FL"];
                }}
              /> ) : <p>{data.address.city}, {data.address.state}</p>}
            </Col>
          </Row>
        </section>
      </article>
    </Form>
  );
}
