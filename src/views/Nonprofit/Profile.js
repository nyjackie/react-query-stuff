import React from 'react';
import { Col, Row, Image } from 'react-bootstrap';
import styles from './Profile.module.scss';

export default function Profile({ data }) {
  return (
    <article className={styles['np-profile']}>
      <header>
        <h2>{data.organization_name}</h2>
        <p>{data.ntee_code}</p>
      </header>
      <Row>
        <Col lg={4}>
          <div className={styles['stat-block']}>
            <p>icon</p>
            <p>Stat title</p>
            <p className={styles['large-stat']}>500K</p>
          </div>
        </Col>
        <Col lg={4}>
          <div className={styles['stat-block']}>
            <p>icon</p>
            <p>Stat title</p>
            <p className={styles['large-stat']}>500K</p>
          </div>
        </Col>
        <Col lg={4}>
          <div className={styles['stat-block']}>
            <p>icon</p>
            <p>Stat title</p>
            <p className={styles['large-stat']}>500K</p>
          </div>
        </Col>
      </Row>
      <Row>
        <h3>Profile photo</h3>
      </Row>
      <Row>
        <Col md={3}>
          <Image className={styles.logoImg} fluid src="missing.jpg" alt="logo" />
        </Col>
        <Col>
          <Image className={styles.coverImg} fluid src="missing.jpg" alt="cover" />
        </Col>
      </Row>
    </article>
  );
}
