// external libs
import React, { useState, useRef } from 'react';
import CsvDownloader from 'react-csv-downloader';
import merge from 'lodash/merge';
import { Col, Row, Media, Button, Form, Alert } from 'react-bootstrap';

// styles
import 'gdd-components/dist/styles/shared.scss';
import styles from './NonProfitInfo.module.scss';


// GDD Components
import {
  UploadableImg,
  SorTable,
  Tooltip,
  InputSwap
} from 'gdd-components';

// our utils
import { processForDownload } from 'utils/donation';
import { serialize } from 'utils';

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
      console.log(obj);
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
          <h3>
            Profile{" "}
            <Tooltip>
              <Tooltip.Content id="profile-info">
                <p>
                  <b>How can I update my organization's profile information?</b>
                </p>
                <p>
                  It is a long established fact that a reader will be distracted by the readable
                  content of a page when looking at its layout
                </p>
                <p>
                  <b>How can I update my organization's profile information?</b>
                </p>
                <p>
                  It is a long established fact that a reader will be distracted by the readable
                  content of a page when looking at its layout
                </p>
                <p>
                  <b>How can I update my organization's profile information?</b>
                </p>
                <p>
                  It is a long established fact that a reader will be distracted by the readable
                  content of a page when looking at its layout
                </p>
              </Tooltip.Content>
            </Tooltip>
          </h3>
          <hr />
          <InputSwap label="Name" editMode={editing} name="name">
            <h2>{data.name}</h2>
          </InputSwap>
          <InputSwap label="Organization type" editMode={editing} name="ntee_code">
            <p>{data.ntee_code}</p>
          </InputSwap>
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
                helpText="Photo should be square"
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
              <InputSwap label="Mission statement" multiline editMode={editing} name="mission">
                <p>{data.mission}</p>
              </InputSwap>
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
              <InputSwap label="Website url" editMode={editing} name="website_url" inputType="url">
                <a href={data.website_url} target="_blank" rel="noopener noreferrer">
                  {data.website_url}
                </a>
              </InputSwap>
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
                  <SorTable
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
        
      </article>
    </Form>
  );
}
