import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Luxon } from 'gdd-components';

const SingleResult = ({ item }) => {
  const {
    activation_id,
    affluent_date_created,
    gd_status,
    consumer_payout,
    nonprofit_payout,
    revenue,
    user_id,
    nonprofit_id,
    transaction_guid,
  } = item;
  return (
    <Card>
      <Card.Body>
        <Card.Title> Transaction Guid: {transaction_guid}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Created: <Luxon format="mm/dd/yy, tt">{affluent_date_created}</Luxon>
        </Card.Subtitle>
      </Card.Body>
    </Card>
  );
};

export default SingleResult;
