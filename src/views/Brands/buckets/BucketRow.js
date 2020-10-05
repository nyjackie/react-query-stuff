import React from 'react';
import APDetails from './APDetails';
import { useFormik } from 'formik';
import { Button, Col, Accordion, Row, Form, Card, Popover, OverlayTrigger } from 'react-bootstrap';
import Moment from 'react-moment';
import { useCategories } from 'hooks/useBrands';
import { object as yupObject, string as yupString, number as yupNumber } from 'yup';
import { useUpdateBucket, useDeleteBucket } from 'hooks/useBrands';
import { connect } from 'react-redux';
import { addNotification } from 'actions/notifications';
import PropTypes from 'prop-types';

const schema = yupObject({
  title: yupString().required('Title cannot be empty.').max(255, 'max 255 characters'),
  bucket_sort_order: yupNumber().typeError('Please enter sort order.'),
});

const BucketRow = ({ bucket, addNotification, setShow }) => {
  const { id, created_at, modified_at } = bucket;
  const { data: categories = [] } = useCategories();
  const [updateBucket] = useUpdateBucket();
  const [deleteBucket] = useDeleteBucket();

  const formik = useFormik({
    initialValues: bucket,
    validationSchema: schema,
    onSubmit: values => {
      if (values.brand_category_id === '' || values.brand_category_id === null) {
        values.brand_category_id = null;
      } else {
        values.affiliate_offers = null;
        values.brand_category_id = +values.brand_category_id;
      }
      if (values.active === true || values.active === 'true') {
        values.active = true;
      } else {
        values.active = false;
      }
      updateBucket({ form: values })
        .then(() => {
          addNotification(`Bucket update success`, 'success');
        })
        .catch(err => {
          addNotification(`Bucket update failed. ${err?.response?.data?.message}`, 'error');
        });
      setShow(false);
    },
  });
  const popover = (
    <Popover id="popover-basic">
      <Popover.Content className="text-center">
        <p>
          This action will <strong>DELETE</strong> this bucket
        </p>
        <Button variant="danger" onClick={() => console.log(deleteBucket({ id: id }))}>
          DELETE BUCKET
        </Button>
      </Popover.Content>
    </Popover>
  );
  return (
    <Row className="mt-2 mb-2">
      <Col>
        <Card>
          <Card.Body>
            {id && <h6>ID: #{id}</h6>}
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Accordion>
                <Form.Row>
                  <Form.Group as={Col} controlId="title">
                    <Form.Label>
                      <b>Title:</b>
                    </Form.Label>
                    <Form.Control
                      placeholder="Title"
                      type="title"
                      name="title"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.title || ''}
                      isValid={formik.touched.title && !formik.errors.title}
                      isInvalid={!!formik.errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} sm={2} controlId="sortOrder">
                    <Form.Label>
                      <b>Sort Order:</b>
                    </Form.Label>
                    <Form.Control
                      placeholder="Sort Order"
                      type="bucket_sort_order"
                      name="bucket_sort_order"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.bucket_sort_order}
                      isValid={formik.touched.bucket_sort_order && !formik.errors.bucket_sort_order}
                      isInvalid={!!formik.errors.bucket_sort_order}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.bucket_sort_order}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} sm="2" controlId="category">
                    <Form.Label>
                      <b>Category:</b>
                    </Form.Label>
                    <Form.Control
                      placeholder="Category"
                      as="select"
                      type="brand_category_id"
                      name="brand_category_id"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.brand_category_id || 'Manual Mode'}
                      isValid={formik.touched.brand_category_id && !formik.errors.brand_category_id}
                      isInvalid={!!formik.errors.brand_category_id}
                    >
                      <option value=""> Manual Mode</option>
                      {categories.map(cat => (
                        <option key={`category-${cat.category_id}`} value={cat.category_id}>
                          {cat.title}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.brand_category_id}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} sm="auto" controlId="type">
                    <Form.Label>
                      <b>Type:</b>
                    </Form.Label>
                    <Form.Control
                      placeholder="Type"
                      as="select"
                      type="presentation_type"
                      name="presentation_type"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.presentation_type || ''}
                      isValid={formik.touched.presentation_type && !formik.errors.presentation_type}
                      isInvalid={!!formik.errors.presentation_type}
                    >
                      <option value={'LIST'}>LIST</option>
                      <option value={'TILE'}>TILE</option>
                      <option value={'HERO'}>HERO</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.presentation_type}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} sm="auto" controlId="active">
                    <Form.Label>
                      <b>Active:</b>
                    </Form.Label>
                    <Form.Control
                      placeholder="active"
                      as="select"
                      type="active"
                      name="active"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.active}
                      isValid={formik.touched.active && !formik.errors.active}
                      isInvalid={!!formik.errors.active}
                    >
                      <option value={true}>True</option>
                      <option value={false}>False</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.active}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Col sm="auto">
                    <label>
                      <b>Created / Modified:</b>
                    </label>
                    <br />
                    <p>
                      <Moment format="MMM, DD">{created_at}</Moment> /{' '}
                      <Moment format="MMM, DD">{modified_at}</Moment>
                    </p>
                  </Col>
                </Form.Row>
                <Row>
                  <Col className="d-flex">
                    <Accordion.Toggle
                      disabled={
                        !(
                          formik.values.brand_category_id === '' ||
                          formik.values.brand_category_id === null
                        )
                      }
                      as={Button}
                      eventKey={id}
                      className=" align-self-center  mt-3 mr-2"
                    >
                      View
                    </Accordion.Toggle>

                    <Button type="submit" className=" align-self-center  mt-3">
                      Save
                    </Button>
                    {id && (
                      <OverlayTrigger trigger="click" placement="left" overlay={popover}>
                        <Button variant="danger" className="ml-auto mt-3">
                          X
                        </Button>
                      </OverlayTrigger>
                    )}
                  </Col>
                </Row>
                {(formik.values.brand_category_id === '' ||
                  formik.values.brand_category_id === null) && (
                  <Accordion.Collapse eventKey={id}>
                    <APDetails
                      offers={formik.values.affiliate_offers}
                      bucket_id={id}
                      setFieldValue={formik.setFieldValue}
                    />
                  </Accordion.Collapse>
                )}
              </Accordion>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

BucketRow.propTypes = {
  addNotification: PropTypes.func.isRequired,
};

export default connect(null, { addNotification })(BucketRow);
