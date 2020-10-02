import React from 'react';
import APDetails from './APDetails';
import { useFormik } from 'formik';
import { Button, Col, Accordion, Row, Form, Card } from 'react-bootstrap';
import Moment from 'react-moment';

const BucketRow = ({ bucket }) => {
  const { id, created_at, modified_at } = bucket;
  const formik = useFormik({
    initialValues: bucket,
    onSubmit: values => {
      console.log(values);
    },
  });
  return (
    <Row className="mt-2 mb-2">
      <Col>
        <Card>
          <Card.Body>
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Form.Row>
                <Form.Group as={Col} controlId="bucketId">
                  <Form.Label>
                    <b>ID:</b>
                  </Form.Label>
                  <Form.Control
                    placeholder="ID"
                    type="id"
                    name="id"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.id}
                    isValid={formik.touched.id && !formik.errors.id}
                    isInvalid={!!formik.errors.id}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.id}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="sortOrder">
                  <Form.Label>
                    <b>Sort Order:</b>
                  </Form.Label>
                  <Form.Control
                    placeholder="bucket_sort_order"
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
                <Form.Group as={Col} controlId="active">
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
                    <option value={true}>true</option>
                    <option value={false}>false</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.active}
                  </Form.Control.Feedback>
                </Form.Group>
                <Col>
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
                <Form.Group as={Col} controlId="category">
                  <Form.Label>
                    <b>Category:</b>
                  </Form.Label>
                  <Form.Control
                    placeholder="Category"
                    type="brand_category_id"
                    name="brand_category_id"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.brand_category_id || ''}
                    isValid={formik.touched.brand_category_id && !formik.errors.brand_category_id}
                    isInvalid={!!formik.errors.brand_category_id}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.brand_category_id}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="type">
                  <Form.Label>
                    <b>Type:</b>
                  </Form.Label>
                  <Form.Control
                    placeholder="Category"
                    type="presentation_type"
                    name="presentation_type"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.presentation_type || ''}
                    isValid={formik.touched.presentation_type && !formik.errors.presentation_type}
                    isInvalid={!!formik.errors.presentation_type}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.presentation_type}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Accordion>
                <Accordion.Toggle as={Button} eventKey={id} className="mr-2">
                  View
                </Accordion.Toggle>
                <Button type="submit">Save</Button>
                <Accordion.Collapse eventKey={id}>
                  <APDetails offers={formik.values.affiliate_offers} key={id} />
                </Accordion.Collapse>
              </Accordion>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default BucketRow;
