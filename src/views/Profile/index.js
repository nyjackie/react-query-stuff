import React from 'react';
import { Col, Row, Image, Media } from 'react-bootstrap';
import LineChart from 'components/Charts/Line';
import { MONTHS_SHORT } from 'components/Charts/constants';
import styles from './Profile.module.scss';

const Img = props => {
  return <Image onError={e => e.target.classList.add(styles['img-fail'])} {...props} />;
};

export default function Profile({ data }) {
  return (
    <article className={styles['np-profile']}>
      <header className={styles.header}>
        <h3>Welcome to your profile</h3>
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
      <section>
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
      </section>
      <section>
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
      </section>
      <section>
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
      </section>
      <section>
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
              color="green"
            />
          </Col>
        </Row>
      </section>
      <section>
        <Row>
          <Col>
            <h3>Donation Tracking</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <ul className={styles['donation-list']}>
              {Array(50)
                .fill('')
                .map((e, i) => {
                  return (
                    <li key={`temp-${i}`}>
                      <Media>
                        <span className={styles.circle} />
                        <Media.Body className={styles['donation-list-body']}>
                          <p>$50 by Jamie Lee 2 minutes ago</p>
                        </Media.Body>
                      </Media>
                    </li>
                  );
                })}
            </ul>
          </Col>
        </Row>
      </section>
    </article>
  );
}
