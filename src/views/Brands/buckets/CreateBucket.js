import React, { Fragment, useState } from 'react';
import { Button, Modal, Col, Row } from 'react-bootstrap';
import BucketRow from './BucketRow';

const initialState = {
  active: true,
  affiliate_offers: [],
  brand_category_id: null,
  bucket_sort_order: null,
  created_at: new Date().toISOString(),
  id: null,
  modified_at: new Date().toISOString(),
  presentation_type: 'TILE',
  title: '',
};

const CreateBucket = () => {
  const [bucket] = useState(initialState);
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
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Create new bucket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BucketRow bucket={bucket} />
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default CreateBucket;
