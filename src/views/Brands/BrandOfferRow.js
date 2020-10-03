// third party
import React from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

// internal
import { useNonprofit } from 'hooks/useNonprofits';
import styles from './Brands.module.scss';

function BrandOfferRow({ affiliate_program, onClick }) {
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
    supported_nonprofit_id,
  } = affiliate_program;

  const { data: supportedNP } = useNonprofit(supported_nonprofit_id);

  return (
    <Row className={styles.offerRow}>
      <Col sm={12} md={5}>
        <p>
          <b>Begins:</b> <span>{begins_at ? moment(begins_at).format('MM/DD/YY') : 'N/A'}</span>
        </p>
        <p>
          <b>Ends:</b> <span>{ends_at ? moment(ends_at).format('MM/DD/YY') : 'N/A'}</span>
        </p>
        <p>
          <b>Supported Nonprofit: </b>
          <span>
            {supported_nonprofit_id && supportedNP ? (
              <Link target="_blank" to={`/nonprofit/${supportedNP.id}`}>
                {supportedNP.name}
              </Link>
            ) : (
              '--'
            )}
          </span>{' '}
          {supported_nonprofit_id && <span>id: {supported_nonprofit_id}</span>}
        </p>
        <p>
          <b>Offer ID:</b>
          <span>{offer_guid}</span>
        </p>
        <p>
          <b>Program ID:</b>
          <span>{program_id}</span>
        </p>
        <p>
          <b>Offer Type:</b>
          <span>{offer_type}</span>
        </p>
      </Col>
      <Col sm={12} md={5}>
        <p>
          <b>Consumer Payout:</b>
          <span>{base_consumer_payout}</span>
        </p>
        <p>
          <b>Commission:</b>
          <span>{commission}</span>
        </p>
        <p>
          <b>Commission Type:</b>
          <span>{commission_type}</span>
        </p>
        <p>
          <b>Is Disabled:</b>
          <span>{String(is_disabled)}</span>
        </p>
        <p>
          <b>Is Groomed:</b>
          <span>{String(is_groomed)}</span>
        </p>
      </Col>
      <Col className="v-center" md={2}>
        <Button variant="primary" onClick={onClick}>
          View Offer
        </Button>
      </Col>
    </Row>
  );
}

export default BrandOfferRow;
