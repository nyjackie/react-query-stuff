import React, { Fragment, useState } from 'react';
import { Button, Modal, Col, Row } from 'react-bootstrap';
import BucketRow from './BucketRow';

const initialState = {
  active: true,
  affiliate_offers: null,
  brand_category_id: null,
  bucket_sort_order: null,
  created_at: null,
  id: null,
  modified_at: null,
  presentation_type: null,
  title: null,
};

const CreateBucket = () => {
  const [bucket, setBucket] = useState(initialState);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <Fragment>
      <Row>
        <Col className="text-right">
          <Button onClick={handleShow}>+ Create New Bucket</Button>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BucketRow bucket={bucket} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default CreateBucket;
