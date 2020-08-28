import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Col, Row, Table, Jumbotron, Form, Button } from 'react-bootstrap';
import APModal from './APModal';
import PageHeader from 'components/PageHeader';
import moment from 'moment';
import { ImageUpload } from 'gdd-components';
import { cn } from 'gdd-components/dist/utils';
import styles from './Brands.module.scss';
import { useFormik } from 'formik';
import {
  object as yupObject,
  number as yupNumber,
  string as yupString,
  boolean as yupBoolean,
} from 'yup';

// MOCK DATA
const brand = {
  id: 1,
  brand_category_id: 132432,
  master_merchant_id: 143214312,
  logo_url: 'https://picsum.photos/seed/barrel/215/215',
  hero_url: 'https://picsum.photos/seed/0/375/240',
  name: 'random company',
  created_at: moment().utc().format(),
  modified_at: moment().utc().format(),
  is_disabled: true,
  is_groomed: true,
};

// offers
const offers = [
  {
    base_consumer_payout: 5,
    begins_at: moment().utc().format(),
    ends_at: moment().utc().format(),
    commission: 10,
    commission_type: 'commission_type',
    disclaimer: 'disclaimer',
    is_disabled: false,
    is_groomed: false,
    offer_guid: 'offer_guid',
    offer_type: 'offer_type',
    supported_nonprofit_id: 16156,
  },
  {
    base_consumer_payout: 5,
    begins_at: moment().utc().format(),
    ends_at: moment().utc().format(),
    commission: 10,
    commission_type: 'commission_type2',
    disclaimer: 'disclaimer2',
    is_disabled: false,
    is_groomed: false,
    offer_guid: 'offer_guid2',
    offer_type: 'offer_type2',
    supported_nonprofit_id: 16156,
  },
  {
    base_consumer_payout: 5,
    begins_at: moment().utc().format(),
    ends_at: moment().utc().format(),
    commission: 10,
    commission_type: 'commission_type3',
    disclaimer: 'disclaimer3',
    is_disabled: false,
    is_groomed: false,
    offer_guid: 'offer_guid3',
    offer_type: 'offer_type3',
    supported_nonprofit_id: 16156,
  },
  {
    base_consumer_payout: 5,
    begins_at: moment().utc().format(),
    ends_at: moment().utc().format(),
    commission: 10,
    commission_type: 'commission_type4',
    disclaimer: 'disclaimer4',
    is_disabled: false,
    is_groomed: false,
    offer_guid: 'offer_guid4',
    offer_type: 'offer_type4',
    supported_nonprofit_id: 16156,
  },
  {
    base_consumer_payout: 5,
    begins_at: new Date(),
    ends_at: new Date(),
    commission: 10,
    commission_type: 'commission_type5',
    disclaimer: 'disclaimer5',
    is_disabled: false,
    is_groomed: false,
    offer_guid: 'offer_guid5',
    offer_type: 'offer_type5',
    supported_nonprofit_id: 16156,
  },
];

const schema = yupObject({
  logo_url: yupString().ensure().trim().url('invalid url'),
  hero_url: yupString().ensure().trim().url('invalid url'),
  name: yupString().required('Brand name cannot be empty.'),
  is_disabled: yupBoolean().required('Visibility cannot be empty.'),
  is_groomed: yupBoolean().required('Groomed status cannot be empty.'),
  brand_category_id: yupNumber().required('Category ID cannot be empty.'),
});

const BrandInfo = () => {
  const [edit, toggleEdit] = useState(true);
  const [show, setShow] = useState(false);
  const [offer, setOffer] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { id, master_merchant_id, logo_url, hero_url, created_at, modified_at } = brand;

  const formik = useFormik({
    validationSchema: schema,
    initialValues: brand,
    onSubmit: values => {
      const time = moment().utc().format();
      const form = { ...values, modified_at: time };
      console.log(form);
    },
  });
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
  return (
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
            <Form onSubmit={formik.handleSubmit}>
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
                    defaultValue={formik.values.is_disabled}
                    aria-describedby="is_disabled"
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.is_disabled}
                  >
                    <option value={false}>Enabled</option>
                    <option value={true}>Disabled</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.is_disabled}
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
                    defaultValue={formik.values.is_groomed}
                    aria-describedby="is_groomed"
                    onChange={formik.handleChange}
                    isInvalid={!!formik.errors.is_groomed}
                  >
                    <option value={true}>Complete</option>
                    <option value={false}>Incomplete</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.is_groomed}
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
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    aria-describedby="name"
                    isInvalid={!!formik.errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>
                    <b>Category: </b>
                  </Form.Label>
                  <Form.Control
                    plaintext={edit}
                    readOnly={edit}
                    name="brand_category_id"
                    value={formik.values.brand_category_id}
                    onChange={formik.handleChange}
                    id="brand_category_id"
                    aria-describedby="brand_category_id"
                    isInvalid={!!formik.errors.brand_category_id}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.brand_category_id}
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
                        src={hero_url}
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
              </Form.Row>
              <Form.Row>
                <Col className="text-right">{!edit && <Button type="submit">Submit</Button>}</Col>
              </Form.Row>
            </Form>
          </Col>
        </Row>
        <Table hover variant="light">
          <thead>
            <tr>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Base Consumer Payout</th>
              <th>Offer ID</th>
              <th>Offer Type</th>
              <th>Commision</th>
              <th>Commission Type</th>
              <th>External Visibility</th>
              <th>Groomed Status</th>
              <th>Disclaimer</th>
              <th>Supported Nonprofit</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => {
              const {
                base_consumer_payout,
                begins_at,
                ends_at,
                commission,
                commission_type,
                disclaimer,
                is_disabled,
                is_groomed,
                offer_guid,
                offer_type,
                supported_nonprofit_id,
              } = offer;
              return (
                <tr
                  onClick={() => {
                    setOffer(offer);
                    handleShow();
                  }}
                  key={offer_guid}
                >
                  <td>{moment(begins_at).format('MM/DD/YYYY')}</td>
                  <td>{moment(ends_at).format('MM/DD/YYYY')}</td>
                  <td>{base_consumer_payout}</td>
                  <td>{offer_guid}</td>
                  <td>{offer_type}</td>
                  <td>{commission}</td>
                  <td>{commission_type}</td>
                  <td>{is_disabled ? 'Enabled' : 'Disabled'}</td>
                  <td>{is_groomed ? 'Complete' : 'Incomplete'}</td>
                  <td>{disclaimer}</td>
                  <td>{supported_nonprofit_id}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Jumbotron>
      {offer && <APModal show={show} offer={offer} handleClose={handleClose} />}
    </Fragment>
  );
};

export default BrandInfo;
