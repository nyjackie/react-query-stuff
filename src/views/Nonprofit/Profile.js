import React from 'react';
import { Col, Row, Image } from 'react-bootstrap';
import LineChart from 'components/Charts/Line';
import { MONTHS_SHORT } from 'components/Charts/constants';
import styles from './Profile.module.scss';

const Img = props => {
  return <Image onError={e => e.target.classList.add(styles['img-fail'])} {...props} />;
};

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
        <Col>
          <h3>Profile photo</h3>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Img className={styles.logoImg} fluid src="missing.jpg" alt="logo" />
        </Col>
        <Col>
          <Img className={styles.coverImg} fluid src="missing.jpg" alt="cover" />
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Mission</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>{data.mission}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Website</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            <a href={data.website_url} target="_blank" rel="noopener noreferrer">
              {data.website_url}
            </a>
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Additional Insights</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <LineChart
            responsive
            data={[0, 0, 0.1, 0.2, 0.25, 0.3, 0.5, 0.6, 0.57, 0.75, 1.2, 1.9]}
            labels={MONTHS_SHORT}
          />
        </Col>
      </Row>
    </article>
  );
}
