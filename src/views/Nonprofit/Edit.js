// external libs
import React, { useState, useRef } from 'react';
import merge from 'lodash/merge';
import { Col, Row, Button, Form, Alert, Container } from 'react-bootstrap';

// styles
import 'gdd-components/dist/styles/shared.scss';
import styles from './NonProfitInfo.module.scss';

// GDD Components
import { UploadableImg } from 'gdd-components';

// GDD utils
import { cn } from 'gdd-components/dist/utils';

// our utils
import { serialize } from 'utils';

export default function Profile({ data, onSave }) {
  const [validated, setValidated] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const formRef = useRef(null);

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
          setSaveError(null);
        })
        .catch(err => {
          setSaveError(err.message);
        });
    }
    setValidated(true);
  }

  return (
    <Row>
      <Col lg={10}>
        <Form
          encType="multipart/form-data"
          noValidate
          validated={validated}
          ref={formRef}
          onSubmit={handleSubmit}
          className="container"
        >
          <input type="hidden" defaultValue={data.ein} name="ein" />

          <article className={styles.profile}>
            <header className="d-flex flex-row justify-content-between align-items-end mt-3">
              <h2 className="h2">Profile</h2>
              <div className="controls">
                <Button
                  onClick={e => {
                    e.preventDefault();
                  }}
                  variant="outline-primary"
                >
                  Preview
                </Button>
                <Button type="submit" variant="success" className="ml-3">
                  Publish
                </Button>
                <Button
                  variant="danger"
                  className="ml-5"
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  Ban User
                </Button>
              </div>
            </header>
            <h3 className="mb-5 h3">{data.name}</h3>

            {saveError && (
              <Row>
                <Col>
                  <Alert variant="danger">{saveError}</Alert>
                </Col>
              </Row>
            )}

            <section>
              <Row className="mb-4">
                <Col>
                  <h3 className="h3">Profile Image</h3>
                </Col>
              </Row>
              <Row>
                <Col xl={3}>
                  <UploadableImg
                    editMode={true}
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
                <Col xl={9}>
                  <UploadableImg
                    editMode={true}
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
                  <h3 className="h3">Mission</h3>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p>{data.mission}</p>
                </Col>
              </Row>
            </section>
            <section>
              <Row>
                <Col>
                  <h3 className="d-inline-block mr-4 h3">Website</h3>
                </Col>
              </Row>
              <Row>
                <Col>
                  <a href={data.website_url} target="_blank" rel="noopener noreferrer">
                    {data.website_url}
                  </a>
                </Col>
              </Row>
            </section>
            <section>
              <Row>
                <Col>
                  <h3 className="h3">Location</h3>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p>
                    {data.address.city}, {data.address.state}
                  </p>
                </Col>
              </Row>
            </section>
          </article>
        </Form>
      </Col>
    </Row>
  );
}
