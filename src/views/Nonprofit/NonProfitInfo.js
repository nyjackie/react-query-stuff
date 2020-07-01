// external libs
import React, { useState, useRef } from 'react';
import CsvDownloader from 'react-csv-downloader';
import merge from 'lodash/merge';
import { Col, Row, Media, Button, Form, Alert } from 'react-bootstrap';

// styles
import styles from './NonProfitInfo.module.scss';

// our components
import {LineChart, GeoMap, BarChart, PieChart } from 'gdd-components'
import SortableTable from 'components/SortableTable';
import Editable from 'components/Editable';
import UploadableImg from 'components/UploadableImg';

// our utils
import { MONTHS_SHORT } from 'components/Charts/constants';
import { processForDownload } from 'utils/donation';
import { serialize } from 'utils';

//Mock Data
import dummyData from 'components/Charts/dummydata.csv'

export default function Profile({ data, onSave }) {
  const [editing, setEditing] = useState(false);
  const [validated, setValidated] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const formRef = useRef(null);

  function toggleEdit(e) {
    e.preventDefault();
    setEditing(!editing);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      console.log('validation failed');
    } else {
      const obj = serialize(formRef.current, false);
      const newData = merge({}, data, obj);
      onSave(newData)
        .then(() => {
          setEditing(false);
          setSaveError(null);
        })
        .catch(err => {
          setSaveError(err.message);
        });
    }
    setValidated(true);
  }

  return (
    <Form
      encType="multipart/form-data"
      noValidate
      validated={validated}
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <input type="hidden" defaultValue={data.ein} name="ein" />
      <article className={styles['np-profile']}>
        <div className="controls">
          <Button onClick={toggleEdit} variant={editing ? 'danger' : 'primary'}>
            {editing ? 'Discard' : 'Edit'}
          </Button>
          {editing && (
            <Button type="submit" variant="success">
              Publish
            </Button>
          )}
        </div>
        {editing && saveError && (
          <Row>
            <Col>
              <Alert variant="danger">{saveError}</Alert>
            </Col>
          </Row>
        )}
        <header className={styles.header}>
          <h3>Welcome to your profile</h3>
          <Editable label="Name" editMode={editing} name="name">
            <h2>{data.name}</h2>
          </Editable>
          <Editable label="Organization type" editMode={editing} name="ntee_code">
            <p>{data.ntee_code}</p>
          </Editable>
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
              <UploadableImg
                editMode={editing}
                uploadText="Upload Profile Photo"
                className={styles.logoImg}
                src={data.logo_url}
                alt="logo"
                name="logo_url"
                helpText="Provide a square photo. Max size 500k"
              />
            </Col>
            <Col>
              <UploadableImg
                editMode={editing}
                uploadText="Upload Cover Photo"
                className={styles.coverImg}
                src={data.hero_url}
                alt="cover photo"
                name="hero_url"
                helpText="Recommended dimensions 950x215, Max size 2mb"
              />
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
              <Editable label="Mission statement" multiline editMode={editing} name="mission">
                <p>{data.mission}</p>
              </Editable>
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
              <Editable label="Website url" editMode={editing} name="website_url" inputType="url">
                <a href={data.website_url} target="_blank" rel="noopener noreferrer">
                  {data.website_url}
                </a>
              </Editable>
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
                ariaLabel="Donation growth in the last 12 months"
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
        <section>
          <Row>
            <Col>
              <h3>Report</h3>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className={styles.donationTable}>
                <div className={styles.donateTableHead}>
                  <select>
                    <option>Last 3 months</option>
                  </select>
                  <CsvDownloader
                    filename="donate_report"
                    datas={processForDownload(data.donationData)}
                  >
                    <span className={styles.dlCsv}>
                      Download (CSV) <span />
                    </span>
                  </CsvDownloader>
                </div>
                <div className={styles.tableInner}>
                  <SortableTable
                    data={data.donationData}
                    ignore={['user_id']}
                    columnTypes={{ donationAmount: 'currency', donationDate: 'date' }}
                    rowKey="user_id"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </section>
        <section>
          <Row className="justify-content-lg-center">
            <Col className="col-12 col-lg-6">
              <BarChart
                responsive
                title="horizontal barchart"
                data={[4, 5, 7, 6, 3, 5]}
                labels={['18-24', '25-34', '35-44', '45-54', '55-64', '65+']}
                color={[
                  'rgba(255,99,132,0.6)',
                  'rgba(255,206,95,0.6)',
                  'rgba(99,55,132,0.6)',
                  'rgba(10,99,132,0.6)',
                  'rgba(70,200,100,0.6)',
                  'rgba(90,99,132,0.6)',
                ]}
                view="horizontalBar"
              />
            </Col>
            <Col className="col-12 col-lg-6">
              <PieChart
                responsive
                title="horizontal barchart"
                data={[4, 5, 7, 6, 3, 5]}
                labels={['18-24', '25-34', '35-44', '45-54', '55-64', '65+']}
                color={[
                  'rgba(255,99,132,0.6)',
                  'rgba(255,206,95,0.6)',
                  'rgba(99,55,132,0.6)',
                  'rgba(10,99,132,0.6)',
                  'rgba(70,200,100,0.6)',
                  'rgba(90,99,132,0.6)',
                ]}
                view="doughnut"
              />
            </Col>
          </Row>
          <Row className="justify-content-lg-center">
            <Col className="col-12 col-lg-6">
              <BarChart
                responsive
                title="horizontal barchart"
                data={[55, 100, 70, 120, 60, 90]}
                labels={['18-24', '25-34', '35-44', '45-54', '55-64', '65+']}
                color={[
                  'rgba(255,99,132,0.6)',
                  'rgba(255,206,95,0.6)',
                  'rgba(99,55,132,0.6)',
                  'rgba(10,99,132,0.6)',
                  'rgba(70,200,100,0.6)',
                  'rgba(90,99,132,0.6)',
                ]}
                view="horizontalBar"
              />
            </Col>
            <Col className="col-12 col-lg-6">
              <BarChart
                responsive
                title="bar chart"
                data={[1, 0.9, 1.5, 0.75, 1.2, 0.5]}
                labels={['18-24', '25-34', '35-44', '45-54', '55-64', '65+']}
                color={[
                  'rgba(255,99,132,0.6)',
                  'rgba(255,206,95,0.6)',
                  'rgba(99,55,132,0.6)',
                  'rgba(10,99,132,0.6)',
                  'rgba(70,200,100,0.6)',
                  'rgba(90,99,132,0.6)',
                ]}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <GeoMap data={dummyData}/>
            </Col>
          </Row>
        </section>
      </article>
    </Form>
  );
}
