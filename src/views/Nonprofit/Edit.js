// external libs
import React, { useState, useRef } from 'react';
import { Col, Row, Button, Form, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import { object as yupObject, string as yupString } from 'yup';
import { max255 } from 'utils/schema';
import 'gdd-components/dist/styles/shared.scss';
import styles from './NonProfitInfo.module.scss';
import { ImageUpload, USStateSelect, PreviewModal, MultiSelect } from 'gdd-components';
import { cn } from 'gdd-components/dist/utils';
import { useNpCategories } from 'hooks/useNonprofits';

/**
 * @typedef {object} NonProfit
 * @property {number} id
 * @property {string} name
 * @property {string} website_url
 * @property {string} location
 * @property {string} mission
 * @property {string} logo_url
 * @property {string} hero_url
 * @property {array} categories
 * @property {string} supported_since
 * @property {number} amount_raised
 * @property {boolean} active
 */

const schema = yupObject({
  name: max255.required('This field is required'),
  website_url: max255.url('invalid url'),
  category: max255,
  nonprofit_city: max255.required('This field is required'),
  nonprofit_state: yupString().required('This field is required'),
  mission: yupString().max(8000),
});

export default function Profile({ data, onSave }) {
  const [saveError, setSaveError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const { data: options } = useNpCategories();

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

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      hero_url: data.hero_url || '', // file
      logo_url: data.logo_url || '', // file
      name: data.name || '', // text
      categories: data.categories || [], // multiselect
      city: '', // text
      state: '', // state select dropdown
      website_url: data.website_url || '', // text
      mission: data.mission || '', // textarea
    },
    onSubmit: values => {
      console.log('onSubmit values', values);
      // onSave(values)
      //   .then(() => {
      //     setSaveError(null);
      //   })
      //   .catch(err => {
      //     setSaveError(err.message);
      //   });
    },
  });

  console.log('errors', formik.errors);

  return (
    <>
      <Row>
        <Col lg={10}>
          <Form
            encType="multipart/form-data"
            noValidate
            onSubmit={formik.handleSubmit}
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
                      setShowPreview(!showPreview);
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
                    Ban
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
                          name="file_logo"
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
                          uploadText="Hero not yet customized"
                          width={256}
                          height={128}
                          src={data.hero_url}
                          alt="cover photo"
                          name="file_hero"
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
                    <Form.Group controlId="organization_name">
                      <Form.Label>Organization Name</Form.Label>
                      <Form.Control
                        name="name"
                        type="text"
                        maxLength="255"
                        required
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        isValid={formik.touched.name && !formik.errors.name}
                        isInvalid={!!formik.errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Categories</Form.Label>
                      <MultiSelect
                        defaultValue={formik.values.categories}
                        options={options}
                        getOptionLabel={option => option.name}
                        getOptionValue={option => option.id}
                      />
                    </Form.Group>

                    <Row>
                      <Col>
                        <Form.Group controlId="nonprofit_city">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            name="nonprofit_city"
                            type="text"
                            maxLength="255"
                            required
                            onChange={formik.handleChange}
                            value={formik.values.city}
                            isValid={formik.touched.city && !formik.errors.city}
                            isInvalid={!!formik.errors.city}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.city}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col sm={3}>
                        <Form.Group controlId="nonprofit_state">
                          <Form.Label>State</Form.Label>
                          <USStateSelect
                            includeTerritories
                            sort
                            name="nonprofit_state"
                            required
                            onChange={formik.handleChange}
                            value={formik.values.state}
                            isValid={formik.touched.state && !formik.errors.state}
                            isInvalid={!!formik.errors.state}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.state}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group controlId="website_url">
                      <Form.Label>Domain URL</Form.Label>
                      <Form.Control
                        name="website_url"
                        type="text"
                        maxLength="255"
                        onChange={formik.handleChange}
                        value={formik.values.website_url}
                        isValid={formik.touched.website_url && !formik.errors.website_url}
                        isInvalid={!!formik.errors.website_url}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.website_url}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="mission">
                      <Form.Label>Mission</Form.Label>
                      <Form.Control
                        name="mission"
                        as="textarea"
                        rows={8}
                        onChange={formik.handleChange}
                        value={formik.values.mission}
                        isValid={formik.touched.mission && !formik.errors.mission}
                        isInvalid={!!formik.errors.mission}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.mission}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </section>
            </article>
          </Form>
        </Col>
      </Row>
      <PreviewModal show={showPreview} data={formik.values} onHide={() => setShowPreview(false)} />
    </>
  );
}
