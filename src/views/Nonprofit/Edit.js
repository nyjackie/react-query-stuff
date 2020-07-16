// external libs
import React, { useState, useRef } from 'react';
import merge from 'lodash/merge';
import { Col, Row, Button, Form, Alert } from 'react-bootstrap';

// styles
import 'gdd-components/dist/styles/shared.scss';
import styles from './NonProfitInfo.module.scss';

// GDD Components
import { ImageUpload } from 'gdd-components';

// GDD utils
import { cn } from 'gdd-components/dist/utils';

// our utils
import { serialize } from 'utils';

export default function Profile({ data, onSave }) {
  const [validated, setValidated] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const formRef = useRef(null);
  const logoDropRef = useRef(null);
  const openLogoDrop = () => {
    if (logoDropRef.current) {
      logoDropRef.current.open();
    }
  };
  const coverDropRef = useRef(null);
  const openCoverDrop = () => {
    if (coverDropRef.current) {
      coverDropRef.current.open();
    }
  };

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
            <header className={styles.header}>
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
                <Col xl>
                  <div className={styles.uploadBlock}>
                    <div className={styles.uploadImg}>
                      <ImageUpload
                        uploadText="Logo not yet customized"
                        width={128}
                        height={128}
                        src={data.logo_url}
                        alt="logo"
                        name="logo_url"
                        maxSize={2000}
                        minWidth={300}
                        minHeight={300}
                        ref={logoDropRef}
                      />
                    </div>
                    <div className={styles.uploadContent}>
                      <h3 className="h3">Organization Logo</h3>
                      <p>Image should be at least 300*300 px</p>
                      <Button variant="primary" onClick={openLogoDrop}>
                        Upload
                      </Button>
                    </div>
                  </div>
                </Col>
                <Col xl>
                  <div className={styles.uploadBlock}>
                    <div className={cn(styles.uploadImg, styles.uploadImgCover)}>
                      <ImageUpload
                        uploadText="Logo not yet customized"
                        width={256}
                        height={128}
                        src={data.hero_url}
                        alt="cover photo"
                        name="hero_url"
                        maxSize={3000}
                        minWidth={640}
                        minHeight={320}
                        ref={coverDropRef}
                      />
                    </div>
                    <div className={styles.uploadContent}>
                      <h3 className="h3">Cover Photo</h3>
                      <p>Image should be at least 640*320 px</p>
                      <Button variant="primary" onClick={openCoverDrop}>
                        Upload
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </section>
            <section>
              <Row>
                <Col xl>
                  <h3 className="h3">Basic Information</h3>
                </Col>
              </Row>
              <Row>
                <Col xl>
                  <Form.Group controlId="name">
                    <Form.Label>Organization Name</Form.Label>
                    <Form.Control defaultValue={data.name} />
                  </Form.Group>
                  <Form.Group controlId="name">
                    <Form.Label>Location</Form.Label>
                    <Form.Control defaultValue={data.name} />
                  </Form.Group>
                  <Form.Group controlId="website_url">
                    <Form.Label>Domain URL</Form.Label>
                    <Form.Control defaultValue={data.website_url} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="mission">
                    <Form.Label>Mission</Form.Label>
                    <Form.Control as="textarea" rows={8} defaultValue={data.mission} />
                  </Form.Group>
                </Col>
              </Row>
            </section>
          </article>
        </Form>
      </Col>
    </Row>
  );
}
