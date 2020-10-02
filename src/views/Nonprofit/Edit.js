// external libs
import React from 'react';
import { useFormik } from 'formik';
import { object as yupObject, string as yupString, array as yupArray } from 'yup';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

import { USStateSelect, MultiSelect, ProfilePreview } from 'gdd-components';
import { cn } from 'gdd-components/dist/utils';
import 'gdd-components/dist/styles/shared.scss';

import ImageUploadBlock from 'components/ImageUploadBlock';
import { max255, url, zipcode } from 'utils/schema';
import { useNpCategories, useUpdateNPOLogo, useUpdateNPOHero } from 'hooks/useNonprofits';

import styles from './NonProfitInfo.module.scss';

/**
 * Schema should match our {@link NonprofitEditableProps}
 */
const schema = yupObject({
  name: max255.required('This field is required'),
  website_url: url,
  address_line_1: max255,
  address_line_2: max255,
  city: max255.required('This field is required'),
  state: yupString().required('This field is required'),
  zip: zipcode,
  mission: yupString().max(8000, 'max 8000 characters'),
  categories: yupArray().ensure().min(1, 'Please select at least one category'),
});

/**
 * Display and edit a Nonprofit organization's profile
 * @param {object} param0
 * @param {InternalNonProfit} param0.data
 * @param {function} param0.onSave
 */
function Profile({ data, onSave }) {
  const { data: options } = useNpCategories();
  const [updateLogo, { isLoading: logoLoading }] = useUpdateNPOLogo();
  const [updateHero, { isLoading: heroLoading }] = useUpdateNPOHero();

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      hero_url: data.hero_url, // file
      logo_url: data.logo_url, // file
      name: data.name || '', // text
      categories: data.categories || [], // multiselect
      address_line_1: data.address.address_line_1 || '', // text
      address_line_2: data.address.address_line_2 || '', // text
      city: data.address.city || '', // text
      state: data.address.state || '', // state select dropdown
      zip: data.address.zip || '', // text
      website_url: data.website_url || '', // text
      mission: data.mission || '', // textarea
    },
    onSubmit: values => {
      values.location = `${values.city}, ${values.state}`;
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

  return (
    <Container className="block shadow-sm">
      <Row>
        <Col>
          <Form
            encType="multipart/form-data"
            noValidate
            onSubmit={formik.handleSubmit}
            className="container"
          >
            <input type="hidden" defaultValue={data.ein} name="ein" />

            <article className={styles.profile}>
              <Row className={styles.header}>
                <Col sm={12} lg={8}>
                  <h2 className="h2">{data.name}</h2>
                </Col>
              </Row>

              <section>
                <Row>
                  <Col xl>
                    <ImageUploadBlock
                      update_id={data.id}
                      uploadText="Logo not yet customized"
                      width={100}
                      height={100}
                      src={data.logo_url}
                      alt="logo"
                      name="file_logo"
                      // exact
                      sqaure
                      minWidth={300}
                      minHeight={300}
                      title="Organization Logo"
                      reco="Image should be at least 300*300 px"
                      isLoading={logoLoading}
                      onSave={data => {
                        return updateLogo(data);
                      }}
                    />
                  </Col>
                  <Col xl>
                    <ImageUploadBlock
                      uploadText="Cover not yet customized"
                      width={256}
                      height={128}
                      src={data.hero_url}
                      alt="cover photo"
                      name="file_hero"
                      minWidth={375}
                      minHeight={240}
                      update_id={data.id}
                      title="Cover Photo"
                      reco="Image should be at least 375*240 px"
                      isLoading={heroLoading}
                      onSave={data => {
                        return updateHero(data);
                      }}
                    />
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
                        isInvalid={formik.touched.name && formik.errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="np_category">
                      <Form.Label>Categories</Form.Label>
                      <MultiSelect
                        inputId="np_category"
                        name="categories"
                        value={formik.values.categories}
                        onChange={options => {
                          formik.setFieldValue('categories', options);
                        }}
                        options={options}
                        getOptionLabel={option => option.name}
                        getOptionValue={option => option.id}
                      />
                      <Form.Control.Feedback
                        type="invalid"
                        className={cn(formik.errors.categories && 'd-block')}
                      >
                        {formik.errors.categories}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="nonprofit_address1">
                      <Form.Label>Address Line 1</Form.Label>
                      <Form.Control
                        name="address_line_1"
                        type="text"
                        maxLength="255"
                        required
                        onChange={formik.handleChange}
                        value={formik.values.address_line_1}
                        isValid={formik.touched.address_line_1 && !formik.errors.address_line_1}
                        isInvalid={formik.touched.address_line_1 && formik.errors.address_line_1}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.address_line_1}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="nonprofit_address2">
                      <Form.Label>Address Line 2</Form.Label>
                      <Form.Control
                        name="address_line_2"
                        type="text"
                        maxLength="255"
                        required
                        onChange={formik.handleChange}
                        value={formik.values.address_line_2}
                        isValid={formik.touched.address_line_2 && !formik.errors.address_line_2}
                        isInvalid={formik.touched.address_line_2 && formik.errors.address_line_2}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.address_line_2}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col>
                        <Form.Group controlId="nonprofit_city">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            name="city"
                            type="text"
                            maxLength="255"
                            required
                            onChange={formik.handleChange}
                            value={formik.values.city}
                            isValid={formik.touched.city && !formik.errors.city}
                            isInvalid={formik.touched.city && formik.errors.city}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.city}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={3}>
                        <Form.Group controlId="nonprofit_state">
                          <Form.Label>State</Form.Label>
                          <USStateSelect
                            includeTerritories
                            sort
                            name="state"
                            required
                            onChange={formik.handleChange}
                            value={formik.values.state}
                            isValid={formik.touched.state && !formik.errors.state}
                            isInvalid={formik.touched.state && formik.errors.state}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.state}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={2}>
                        <Form.Group controlId="nonprofit_zip">
                          <Form.Label>Zip</Form.Label>
                          <Form.Control
                            name="zip"
                            type="text"
                            maxLength="255"
                            required
                            onChange={formik.handleChange}
                            value={formik.values.zip}
                            isValid={formik.touched.zip && !formik.errors.zip}
                            isInvalid={formik.touched.zip && formik.errors.zip}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.zip}
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
                        isInvalid={formik.touched.website_url && formik.errors.website_url}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.website_url}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="mission">
                      <Form.Label>Mission</Form.Label>
                      <Form.Control
                        name="mission"
                        as="textarea"
                        rows={8}
                        onChange={formik.handleChange}
                        value={formik.values.mission}
                        isValid={formik.touched.mission && !formik.errors.mission}
                        isInvalid={formik.touched.mission && formik.errors.mission}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.mission}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col className="d-flex justify-content-center bg-dark p-4">
                    <ProfilePreview
                      cta="Support This Nonprofit"
                      data={{
                        ...formik.values,
                      }}
                      type="nonprofit"
                    />
                  </Col>
                </Row>
              </section>
            </article>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
