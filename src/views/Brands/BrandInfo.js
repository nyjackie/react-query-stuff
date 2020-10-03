// third party
import React, { Fragment, useState } from 'react';
import { Col, Row, Container, Form, Button, FormControl, Accordion } from 'react-bootstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Formik } from 'formik';
import { Helmet } from 'react-helmet';
import {
  object as yupObject,
  string as yupString,
  boolean as yupBoolean,
  number as yupNumber,
} from 'yup';

// internal
import { addNotification } from 'actions/notifications';
import { useBrand, useCategories, useOffers, useUpdateBrand } from 'hooks/useBrands';
import Spinner from 'components/Spinner';
import OfferRow from './BrandOfferRow';
import OfferEditModal from './OfferEditModal';
import BrandImages from './BrandImages';
import { stringToBool } from 'utils';
import { ReactComponent as GreenCheck } from 'assets/green-check.svg';
import styles from './Brands.module.scss';

const schema = yupObject({
  name: yupString().required('Brand name cannot be empty.').max(255, 'max 255 characters'),
  is_disabled: yupBoolean().required('Visibility cannot be empty.'),
  is_groomed: yupBoolean().required('Groomed status cannot be empty.'),
  website_url: yupString().ensure().trim().url('Invalid url').max(255, 'max 255 characters'),
  ce_brand_id: yupNumber().nullable().typeError('ID has to be numbers'),
  ce_industry_id: yupNumber().nullable().typeError('ID has to be numbers'),
  ce_subindustry_id: yupNumber().nullable().typeError('ID has to be numbers'),
});

function BrandInfo({ addNotification, match }) {
  const [edit, toggleEdit] = useState(true);
  const [show, setShow] = useState(false);
  const [offer, setOffer] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { isLoading: brandLoading, isError: brandError, data: brand = {} } = useBrand(
    match.params.id
  );

  const { isLoading: catLoading, isError: catError, data: categories = [] } = useCategories();

  const {
    isLoading: offerLoading,
    isError: offerError,
    data: { affiliate_programs = [] } = {},
  } = useOffers(brand?.id);

  const [updateBrand] = useUpdateBrand();

  if (brandLoading || offerLoading || catLoading) {
    return <Spinner />;
  }

  if (brandError || offerError || catError) {
    return <div>Oooops something went wrong. Please try again later! </div>;
  }

  if (!brand || !categories || !affiliate_programs) {
    return <div>Oooops something went wrong. Please try again </div>;
  }
  return (
    <Fragment>
      <Helmet>
        <title>{brand?.name ? brand.name : 'Brand'} | Give Good Deeds | Admin Portal</title>
      </Helmet>
      <Container className="block shadow-sm">
        <Row className="mb-3">
          <Col>
            <h2>{brand.name}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>
              <b>Brand ID:</b> {brand.id}
            </p>
            <p>
              <b>FMTC Master Merchant ID:</b> {brand.fmtc_master_merchant_id}
            </p>
            <p>
              <b>FMTC Merchant ID:</b> {brand.fmtc_merchant_id}
            </p>
            <p>
              <b>Created Date: </b>
              {moment(brand.created_at).format('MM/DD/YYYY')}
            </p>
            <p>
              <b>Modified Date: </b>
              {moment(brand.modified_at).format('MM/DD/YYYY')}
            </p>
          </Col>
          <Col md={3}>
            {brand.is_groomed && (
              <>
                <GreenCheck />
                <p>Groomed</p>
              </>
            )}
          </Col>
        </Row>
      </Container>
      <Accordion defaultActiveKey="0">
        <Container>
          <Row>
            <Col className="d-flex justify-content-end">
              <Accordion.Toggle
                as={Button}
                variant="outline-primary"
                eventKey="0"
                onClick={e => {
                  e.target.textContent =
                    e.target.textContent === 'collapse' ? 'expand' : 'collapse';
                }}
              >
                collapse
              </Accordion.Toggle>
            </Col>
          </Row>
        </Container>
        <Container>
          <Accordion.Collapse eventKey="0">
            <Formik
              initialValues={brand}
              validationSchema={schema}
              onSubmit={values => {
                const form = {
                  ...values,
                  is_disabled: stringToBool(values.is_disabled),
                  is_groomed: stringToBool(values.is_groomed),
                };
                updateBrand({ id: brand.id, form })
                  .then(() => {
                    addNotification(`Brand update success`, 'success');
                    toggleEdit(false);
                  })
                  .catch(err => {
                    addNotification(
                      `Brand update failed. ${err?.response?.data?.message}`,
                      'error'
                    );
                  });
              }}
            >
              {props => {
                return (
                  <Row>
                    <Col xs={12} lg={5} className="block shadow-sm">
                      <Button
                        className="mb-4"
                        onClick={() => {
                          toggleEdit(!edit);
                        }}
                        variant={!edit ? 'outline-primary' : 'primary'}
                      >
                        {edit ? 'Edit' : 'Stop editing'}
                      </Button>
                      <BrandForm brand={brand} edit={edit} categories={categories} {...props} />
                    </Col>
                    <Col xs={12} lg={{ span: 6, offset: 1 }} className="block shadow-sm">
                      <BrandImages
                        brand={{
                          ...brand,
                          ...props.values,
                        }}
                      />
                    </Col>
                  </Row>
                );
              }}
            </Formik>
          </Accordion.Collapse>
        </Container>
      </Accordion>

      {affiliate_programs.length > 0 && (
        <Container className="block shadow-sm">
          <Row>
            <Col>
              <h3>Offers</h3>
            </Col>
          </Row>
          {affiliate_programs.map(affiliate_program => {
            return (
              <OfferRow
                key={affiliate_program.offer_guid}
                affiliate_program={affiliate_program}
                onClick={() => {
                  if (!show) {
                    setOffer(affiliate_program);
                    handleShow();
                  }
                }}
              />
            );
          })}
        </Container>
      )}

      {offer && (
        <OfferEditModal show={show} offer={offer} handleClose={handleClose} brand_id={brand.id} />
      )}
    </Fragment>
  );
}

const BrandForm = ({ categories, values, errors, handleChange, edit, handleSubmit }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>
              <b>Brand Name:</b>
            </Form.Label>
            <Form.Control
              readOnly={edit}
              name="name"
              value={values.name}
              onChange={handleChange}
              aria-describedby="name"
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>CE Brand ID:</b>
            </Form.Label>
            <Form.Control
              readOnly={edit}
              name="ce_brand_id"
              value={values.ce_brand_id ?? ''}
              onChange={handleChange}
              aria-describedby="ce_brand_id"
              isInvalid={!!errors.ce_brand_id}
            />
            <Form.Control.Feedback type="invalid">{errors.ce_brand_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>
              <b>CE Sub Industry ID:</b>
            </Form.Label>
            <Form.Control
              readOnly={edit}
              name="ce_subindustry_id"
              value={values.ce_subindustry_id ?? ''}
              onChange={handleChange}
              aria-describedby="ce_subindustry_id"
              isInvalid={!!errors.ce_subindustry_id}
            />
            <Form.Control.Feedback type="invalid">{errors.ce_subindustry_id}</Form.Control.Feedback>
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col}>
              <p id="brandIsDisabled" className="d-inline mr-4">
                <b>Is Disabled:</b>
              </p>
              <Form.Check
                disabled={edit}
                inline
                label="true"
                type="radio"
                name="is_disabled"
                value={true}
                checked={values.is_disabled === 'true' || values.is_disabled === true}
                onChange={handleChange}
                aria-describedby="brandIsDisabled"
                id="brandIsDisabled-TRUE"
              />
              <Form.Check
                disabled={edit}
                inline
                label="false"
                onChange={handleChange}
                type="radio"
                name="is_disabled"
                value={false}
                checked={values.is_disabled === 'false' || values.is_disabled === false}
                aria-describedby="brandIsDisabled"
                id="brandIsDisabled-FALSE"
              />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <p id="brandIsGroomed" className="d-inline mr-4">
                <b>Is Groomed:</b>
              </p>
              <Form.Check
                disabled={edit}
                inline
                label="true"
                type="radio"
                name="is_groomed"
                value={true}
                checked={values.is_groomed === 'true' || values.is_groomed === true}
                onChange={handleChange}
                aria-describedby="brandIsGroomed"
                id="brandIsGroomed-TRUE"
              />
              <Form.Check
                disabled={edit}
                inline
                label="false"
                onChange={handleChange}
                type="radio"
                name="is_groomed"
                value={false}
                checked={values.is_groomed === 'false' || values.is_groomed === false}
                aria-describedby="brandIsGroomed"
                id="brandIsGroomed-FALSE"
              />
            </Form.Group>
          </Form.Row>

          <Form.Group>
            <Form.Label>
              <b>Website Url:</b>
            </Form.Label>
            <Form.Control
              readOnly={edit}
              name="website_url"
              value={values.website_url}
              onChange={handleChange}
              aria-describedby="website_url"
              isInvalid={!!errors.website_url}
            />
            <Form.Control.Feedback type="invalid">{errors.website_url}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>Category </b>
            </Form.Label>
            <FormControl
              name="brand_category_id"
              as="select"
              custom
              className={`${styles.select} form-control-plaintext`}
              readOnly={edit}
              disabled={edit}
              value={values.brand_category_id}
              onChange={handleChange}
              isInvalid={errors.brand_category_id}
            >
              <option hidden>No category</option>
              {categories.map(cat => (
                <option key={`category-${cat.category_id}`} value={cat.category_id}>
                  {cat.title}
                </option>
              ))}
            </FormControl>

            <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Form.Group>
            <Form.Label>
              <b>Description:</b>
            </Form.Label>
            <Form.Control
              readOnly={edit}
              name="description"
              value={values.description || ''}
              onChange={handleChange}
              id="description"
              aria-describedby="description"
              isInvalid={!!errors.description}
              as="textarea"
              rows="3"
            />
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col className="text-right">{!edit && <Button type="submit">Submit</Button>}</Col>
      </Form.Row>
    </Form>
  );
};

BrandInfo.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default connect(null, { addNotification })(BrandInfo);
