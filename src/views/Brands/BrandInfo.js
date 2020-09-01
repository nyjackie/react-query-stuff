import React, { Fragment, useState, useRef } from 'react';
import { Col, Row, Table, Jumbotron, Form, Button } from 'react-bootstrap';
import APModal from './APModal';
import PageHeader from 'components/PageHeader';
import moment from 'moment';
import { ImageUpload } from 'gdd-components';
import { cn } from 'gdd-components/dist/utils';
import styles from './Brands.module.scss';
import { Formik } from 'formik';
import {
  object as yupObject,
  number as yupNumber,
  string as yupString,
  boolean as yupBoolean,
} from 'yup';
import { useBrand, useOffers } from 'hooks/useBrands';
import Spinner from 'components/Spinner';

const schema = yupObject({
  logo_url: yupString().ensure().trim().url('invalid url').max(255, 'max 255 characters'),
  hero_url: yupString().ensure().trim().url('invalid url').max(255, 'max 255 characters'),
  name: yupString().required('Brand name cannot be empty.').max(255, 'max 255 characters'),
  is_disabled: yupBoolean().required('Visibility cannot be empty.'),
  is_groomed: yupBoolean().required('Groomed status cannot be empty.'),
  brand_category_id: yupNumber()
    .typeError('Brand Category ID must be a number')
    .required('Category ID cannot be empty.'),
});

const BrandInfo = ({ match }) => {
  const [edit, toggleEdit] = useState(true);
  const [show, setShow] = useState(false);
  const [offer, setOffer] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
  const { isLoading: brandLoading, isError: brandError, data: { brand = [] } = {} } = useBrand(
    match.params.ein
  );
  const { id, master_merchant_id, logo_url, hero_url, created_at, modified_at } = brand[0] || {};
  const {
    isLoading: offerLoading,
    isError: offerError,
    data: { affiliate_programs } = {},
  } = useOffers(id);
  if (brandLoading || offerLoading) {
    return <Spinner />;
  }
  if (brandError || offerError) {
    return <div>Oooops something went wrong. Please try again later! </div>;
  }
  return (
    brand && (
      <Fragment>
        <PageHeader className="text-primary" pageTitle="Brand Info" />
        <Jumbotron>
          <Row>
            <Col>
              <Button
                onClick={() => {
                  toggleEdit(!edit);
                }}
              >
                Edit
              </Button>
            </Col>
          </Row>
          <Row className="mt-3 mb-3">
            <Col>
              <Formik
                initialValues={brand[0]}
                validationSchema={schema}
                onSubmit={(values, { setSubmitting }) => {
                  console.log('data', values);
                }}
              >
                {props => {
                  const { values, errors, handleSubmit, handleChange } = props;
                  return (
                    <Form onSubmit={handleSubmit}>
                      <Row className="form-row">
                        <Col className="form-col">
                          <p>
                            <b>Created Date: </b>
                          </p>
                          <p>{moment(created_at).format('MM/DD/YYYY')}</p>
                        </Col>
                        <Col className="form-col">
                          <p>
                            <b>Created Date: </b>
                          </p>
                          <p>{moment(modified_at).format('MM/DD/YYYY')}</p>
                        </Col>
                      </Row>
                      <Row className="form-row">
                        <Col className="form-col">
                          <p>
                            <b>Brand ID:</b>
                          </p>
                          <p>{id}</p>
                        </Col>
                        <Col className="form-col">
                          <p>
                            <b>Merchant ID:</b>
                          </p>
                          <p>{master_merchant_id}</p>
                        </Col>
                      </Row>
                      <Form.Row>
                        <Form.Group as={Col}>
                          <Form.Label>
                            <b>External Visibility:</b>
                          </Form.Label>
                          <Form.Control
                            custom
                            className={`${styles.select} form-control-plaintext`}
                            plaintext={edit}
                            readOnly={edit}
                            disabled={edit}
                            as="select"
                            name="is_disabled"
                            defaultValue={values.is_disabled}
                            aria-describedby="is_disabled"
                            onChange={handleChange}
                            isInvalid={!!errors.is_disabled}
                          >
                            <option value={false}>Enabled</option>
                            <option value={true}>Disabled</option>
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.is_disabled}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label>
                            <b>Groomed Status: </b>
                          </Form.Label>
                          <Form.Control
                            custom
                            className={`${styles.select} form-control-plaintext`}
                            plaintext={edit}
                            readOnly={edit}
                            disabled={edit}
                            as="select"
                            name="is_groomed"
                            defaultValue={values.is_groomed}
                            aria-describedby="is_groomed"
                            onChange={handleChange}
                            isInvalid={!!errors.is_groomed}
                          >
                            <option value={true}>Complete</option>
                            <option value={false}>Incomplete</option>
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.is_groomed}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Col}>
                          <Form.Label>
                            <b>Brand Name:</b>
                          </Form.Label>
                          <Form.Control
                            plaintext={edit}
                            readOnly={edit}
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            aria-describedby="name"
                            isInvalid={!!errors.name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label>
                            <b>Category: </b>
                          </Form.Label>
                          <Form.Control
                            plaintext={edit}
                            readOnly={edit}
                            name="brand_category_id"
                            value={values.brand_category_id}
                            onChange={handleChange}
                            id="brand_category_id"
                            aria-describedby="brand_category_id"
                            isInvalid={!!errors.brand_category_id}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.brand_category_id}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>

                      <Form.Row>
                        <Col xl>
                          <div className={styles.uploadBlock}>
                            <div className={styles.uploadImg}>
                              <ImageUpload
                                uploadText="Logo not yet customized"
                                width={128}
                                height={128}
                                disabled={edit}
                                src={logo_url}
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
                              <Button variant="primary" onClick={openLogoDrop} disabled={edit}>
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
                                src={hero_url}
                                alt="cover photo"
                                name="file_hero"
                                maxSize={3000}
                                minWidth={640}
                                minHeight={320}
                                ref={coverDropRef}
                                disabled={edit}
                              />
                            </div>
                            <div className={styles.uploadContent}>
                              <h3 className="h3">Cover Photo</h3>
                              <p>Image should be at least 640*320 px</p>
                              <Button variant="primary" onClick={openCoverDrop} disabled={edit}>
                                Upload
                              </Button>
                            </div>
                          </div>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>
                              <b>Description:</b>
                            </Form.Label>
                            <Form.Control
                              plaintext={edit}
                              readOnly={edit}
                              name="description"
                              value={values.description}
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
                        <Col className="text-right">
                          {!edit && <Button type="submit">Submit</Button>}
                        </Col>
                      </Form.Row>
                    </Form>
                  );
                }}
              </Formik>
            </Col>
          </Row>
          <Table responsive hover variant="light">
            <thead className="text-right">
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Program ID</th>
                <th>Offer ID</th>
                <th>Offer Type</th>
                <th>Consumer Payout</th>
                <th>Commision</th>
                <th>Commission Type</th>
                <th>External Visibility</th>
                <th>Groomed Status</th>
              </tr>
            </thead>
            <tbody>
              {affiliate_programs.map(affiliate_program => {
                const {
                  base_consumer_payout,
                  begins_at,
                  ends_at,
                  commission,
                  commission_type,
                  is_disabled,
                  is_groomed,
                  offer_guid,
                  offer_type,
                  program_id,
                } = affiliate_program;
                return (
                  <tr
                    onClick={() => {
                      setOffer(affiliate_program);
                      handleShow();
                    }}
                    key={offer_guid}
                    className="text-right"
                  >
                    <td>{begins_at ? moment(begins_at).format('MM/DD/YY') : 'N/A'}</td>
                    <td>{ends_at ? moment(ends_at).format('MM/DD/YY') : 'N/A'}</td>
                    <td>{program_id}</td>
                    <td>{offer_guid.substring(0, 11) + '...'}</td>
                    <td>{offer_type.substring(0, 11) + '...'}</td>
                    <td>{base_consumer_payout}</td>
                    <td>{commission}</td>
                    <td>{commission_type}</td>
                    <td>{is_disabled ? 'Enabled' : 'Disabled'}</td>
                    <td>{is_groomed ? 'Complete' : 'Incomplete'}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Jumbotron>
        {offer && <APModal show={show} offer={offer} handleClose={handleClose} />}
      </Fragment>
    )
  );
};

export default BrandInfo;
