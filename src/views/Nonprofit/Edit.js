// external libs
import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { object as yupObject, string as yupString } from 'yup';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { USStateSelect, MultiSelect, ProfilePreview, AppPreviews } from 'gdd-components';
import { cn } from 'gdd-components/dist/utils';
import 'gdd-components/dist/styles/shared.scss';

import { addNotification } from 'actions/notifications';
import Spinner from 'components/Spinner';
import ImageUploadBlock from 'components/ImageUploadBlock';
import { max255, url, zipcode } from 'utils/schema';
import AllInfoModal from './AllInfoModal';
import {
  useNpCategories,
  useUpdateNPOLogo,
  useUpdateNPOHero,
  useNonprofitProfileUpdate,
} from 'hooks/useNonprofits';

import { stringToBool } from 'utils';
import styles from './NonProfitInfo.module.scss';

function makeLocation(values) {
  return [values.city, values.state].filter(Boolean).join(', ');
}

/**
 * Schema should match our {@link NonprofitEditableProps}
 */
const schema = yupObject({
  name: max255.required('This field is required'),
  website_url: url,
  address_line_1: max255,
  address_line_2: max255,
  city: max255,
  zip: zipcode,
  mission: yupString().max(8000, 'max 8000 characters'),
});

/**
 * Display and edit a Nonprofit organization's profile
 * @param {object} param0
 * @param {InternalNonProfit} param0.data
 */
function Profile({ data, addNotification }) {
  const { data: options } = useNpCategories();
  const [updateLogo, { isLoading: logoLoading }] = useUpdateNPOLogo();
  const [updateHero, { isLoading: heroLoading }] = useUpdateNPOHero();
  const [udateProfile, { isLoading: profileLoading }] = useNonprofitProfileUpdate();
  const [logoSrc, setLogoSrc] = useState(data.logo_url);
  const [heroSrc, setHeroSrc] = useState(data.hero_url);
  const [showModal, setShowModal] = useState(false);

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      name: data.name || '', // text
      categories: data.categories || [], // multiselect
      address_line_1: data.address.address_line_1 || '', // text
      address_line_2: data.address.address_line_2 || '', // text
      city: data.address.city || '', // text
      state: data.address.state || '', // state select dropdown
      zip: data.address.zip || '', // text
      website_url: data.website_url || '', // text
      mission: data.mission || '', // textarea
      is_banned: data.is_banned,
      is_active: data.is_active,
      is_folded: data.is_folded,
    },
    onSubmit: async values => {
      try {
        const body = {
          name: values.name,
          website_url: values.website_url,
          mission: values.mission,
          address: {
            address_line_1: values.address_line_1,
            address_line_2: values.address_line_2,
            city: values.city,
            state: values.state,
            zip: values.zip,
          },
          is_banned: stringToBool(values.is_banned),
          is_active: stringToBool(values.is_active),
          is_folded: stringToBool(values.is_folded),
        };

        if (values.website_url !== '' && !/^(https?)?:\/\//i.test(values.website_url)) {
          body.website_url = 'http://' + values.website_url;
        }

        if (!values.categories) {
          body.categories = [];
        } else {
          body.categories = values.categories.map(c => {
            return { category_id: c.id };
          });
        }
        await udateProfile({ id: data.id, body });
        addNotification('Profile updated!', 'success');
      } catch (err) {
        addNotification(`Update failed: ${err.message}: ${err.response?.data?.message}`, 'error');
      }
    },
  });

  return (
    <Container className={cn('block shadow-sm', styles.profileEdit)}>
      <Row>
        <Col>
          {profileLoading && (
            <div className="spinnerOverlay">
              <Spinner />
            </div>
          )}
          <Form
            encType="multipart/form-data"
            noValidate
            onSubmit={formik.handleSubmit}
            className="container"
          >
            <input type="hidden" defaultValue={data.ein} name="ein" />

            <article className={styles.profile}>
              <Row className={styles.header}>
                <Col>
                  <h1 className="h2">{data.name}</h1>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button
                    variant="outline-primary"
                    onClick={e => {
                      e.preventDefault();
                      setShowModal(true);
                    }}
                  >
                    info
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p>
                    <b>ID:</b> {data.id}
                  </p>
                  <p>
                    <b>EIN:</b> {data.ein}
                  </p>
                </Col>
              </Row>

              <section>
                <Row>
                  <Col xl>
                    <Row className="mt-4 pb-4">
                      <Col xl>
                        <ImageUploadBlock
                          className={styles.imgLogoBlock}
                          update_id={data.id}
                          uploadText="Drag and drop or click to upload"
                          width={100}
                          height={100}
                          src={data.logo_url}
                          alt="logo"
                          name="file_logo"
                          sqaure
                          minWidth={300}
                          minHeight={300}
                          title="Organization Logo"
                          reco="Image should be at least 300*300 px"
                          isLoading={logoLoading}
                          onSave={async data => {
                            try {
                              const resData = await updateLogo(data);
                              addNotification('Logo image uploaded.', 'success');
                              return resData;
                            } catch (err) {
                              addNotification(
                                `Logo upload failed: ${err.message}: ${err.response?.data?.message}`,
                                'error'
                              );
                            }
                          }}
                          onImageSelected={file => {
                            setLogoSrc(file.preview);
                          }}
                          onError={() => {
                            setLogoSrc(data.logo_url);
                          }}
                        />
                      </Col>
                      <Col xl>
                        <ImageUploadBlock
                          className={styles.imgHeroBlock}
                          uploadText="Drag and drop or click to upload"
                          width={375}
                          height={240}
                          src={data.hero_url}
                          alt="cover photo"
                          name="file_hero"
                          minWidth={375}
                          minHeight={240}
                          update_id={data.id}
                          title="Cover Photo"
                          reco="Image should be at least 375*240 px"
                          isLoading={heroLoading}
                          onSave={async data => {
                            try {
                              const resData = await updateHero(data);
                              addNotification('Cover image uploaded.', 'success');
                              return resData;
                            } catch (err) {
                              addNotification(
                                `Cover upload failed: ${err.message}: ${err.response?.data?.message}`,
                                'error'
                              );
                            }
                          }}
                          onImageSelected={file => {
                            setHeroSrc(file.preview);
                          }}
                          onError={() => {
                            setHeroSrc(data.hero_url);
                          }}
                        />
                      </Col>
                    </Row>
                    <Form.Group className="mt-4" controlId="organization_name">
                      <Form.Label>Name (required)</Form.Label>
                      <Form.Control
                        name="name"
                        type="text"
                        maxLength="255"
                        required
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        isInvalid={formik.touched.name && formik.errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="np_category">
                      <Form.Label>Cause Area</Form.Label>
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
                        onChange={formik.handleChange}
                        value={formik.values.address_line_1}
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
                        onChange={formik.handleChange}
                        value={formik.values.address_line_2}
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
                            onChange={formik.handleChange}
                            value={formik.values.city}
                            isInvalid={formik.touched.city && formik.errors.city}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.city}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={2}>
                        <Form.Group controlId="nonprofit_state">
                          <Form.Label>State</Form.Label>
                          <USStateSelect
                            includeTerritories
                            sort
                            name="state"
                            onChange={formik.handleChange}
                            value={formik.values.state}
                            isInvalid={formik.touched.state && formik.errors.state}
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.state}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={3}>
                        <Form.Group controlId="nonprofit_zip">
                          <Form.Label>Zip</Form.Label>
                          <Form.Control
                            name="zip"
                            type="text"
                            maxLength="255"
                            onChange={formik.handleChange}
                            value={formik.values.zip}
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

                    <Form.Row>
                      <Form.Group as={Col}>
                        <p id="npoIsBanned" className="d-inline mr-4">
                          <b>Is Banned:</b>
                        </p>
                        <Form.Check
                          inline
                          label="true"
                          type="radio"
                          name="is_banned"
                          value={true}
                          checked={
                            formik.values.is_banned === 'true' || formik.values.is_banned === true
                          }
                          onChange={formik.handleChange}
                          aria-describedby="npoIsBanned"
                          id="npoIsBanned-TRUE"
                        />
                        <Form.Check
                          inline
                          label="false"
                          onChange={formik.handleChange}
                          type="radio"
                          name="is_banned"
                          value={false}
                          checked={
                            formik.values.is_banned === 'false' || formik.values.is_banned === false
                          }
                          aria-describedby="npoIsBanned"
                          id="npoIsBanned-FALSE"
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group as={Col}>
                        <p id="npoIsActive" className="d-inline mr-4">
                          <b>Is active:</b>
                        </p>
                        <Form.Check
                          inline
                          label="true"
                          type="radio"
                          name="is_active"
                          value={true}
                          checked={
                            formik.values.is_active === 'true' || formik.values.is_active === true
                          }
                          onChange={formik.handleChange}
                          aria-describedby="npoIsActive"
                          id="npoIsActive-TRUE"
                        />
                        <Form.Check
                          inline
                          label="false"
                          onChange={formik.handleChange}
                          type="radio"
                          name="is_active"
                          value={false}
                          checked={
                            formik.values.is_active === 'false' || formik.values.is_active === false
                          }
                          aria-describedby="npoIsActive"
                          id="npoIsActive-FALSE"
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group as={Col}>
                        <p id="npoIsFolded" className="d-inline mr-4">
                          <b>Is folded:</b>
                        </p>
                        <Form.Check
                          inline
                          label="true"
                          type="radio"
                          name="is_folded"
                          value={true}
                          checked={
                            formik.values.is_folded === 'true' || formik.values.is_folded === true
                          }
                          onChange={formik.handleChange}
                          aria-describedby="npoIsFolded"
                          id="npoIsFolded-TRUE"
                        />
                        <Form.Check
                          inline
                          label="false"
                          onChange={formik.handleChange}
                          type="radio"
                          name="is_folded"
                          value={false}
                          checked={
                            formik.values.is_folded === 'false' || formik.values.is_folded === false
                          }
                          aria-describedby="npoIsFolded"
                          id="npoIsFolded-FALSE"
                        />
                      </Form.Group>
                    </Form.Row>

                    <Button type="submit" variant="primary">
                      Update profile
                    </Button>
                  </Col>
                  <Col className="d-none d-md-flex flex-column align-items-center p-4">
                    <ProfilePreview
                      cta="Support This Nonprofit"
                      data={formik.values}
                      logo={logoSrc}
                      hero={heroSrc}
                      type="nonprofit"
                    />
                    <div className="mt-4 p-3">
                      <AppPreviews.Nonprofit
                        logo={logoSrc}
                        hero={heroSrc}
                        name={formik.values.name}
                        location={makeLocation(formik.values)}
                        causeArea={formik.values.categories?.[0]?.name}
                      />
                    </div>
                  </Col>
                </Row>
              </section>
            </article>
          </Form>
        </Col>
      </Row>
      <AllInfoModal data={data} show={showModal} handleClose={() => setShowModal(false)} />
    </Container>
  );
}

Profile.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default connect(null, { addNotification })(Profile);
