import React, { Fragment } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { DateTime } from 'luxon';
import styles from './OfferEditModal.module.scss';

function Meta({ label, val, children }) {
  return (
    <Row>
      <Col sm={12} md={3} className={styles.metaLabel}>
        <p>{label}</p>
      </Col>
      <Col sm={12} md="auto" className={styles.metaVal}>
        <p>{children || val}</p>
      </Col>
    </Row>
  );
}

function Info({ offer }) {
  return (
    <Fragment>
      <Meta label="Created:" val={DateTime.fromISO(offer.created_at).toFormat('MM/dd/yy')} />
      <Meta label="Offer Program ID:" val={offer.program_id} />
      <Meta label="Offer Type:" val={offer.offer_type} />
      <Meta
        label="Shop URL:"
        val={
          <a href={offer.shop_url} target="_blank" rel="noopener noreferrer">
            {offer.shop_url}
          </a>
        }
      />
      <Meta label="Affiliate Network Name:" val={offer.affiliate_network_name} />
    </Fragment>
  );
}

export default Info;
