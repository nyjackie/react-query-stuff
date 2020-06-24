import React, { Fragment, useState, useRef } from 'react';
import { Container, Row, Col, FormControl, InputGroup } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';
import styles from './Fundraise.module.scss';

const Fundraise = () => {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  const [id, setId] = useState('');
  const onClick = e => {
    if (id === e.target.id) {
      setShow(!show);
    } else {
      setId(e.target.id);
      setShow(true);
      console.log(e.target);
    }
  };
  return (
    <Fragment>
      <PageHeader className="text-primary" pageTitle="Fundraising Tools" />
      <Container fluid="lg" className="dashboard">
        <Row>
          <h1>Do we need this on admin portal?</h1>
        </Row>
        <br />
        <Row>
          <h3>Linked Social Accounts</h3>
        </Row>
        <Row>
          <div ref={ref}>
            <i
              className={`fa fa-facebook-square fa-3x ${styles.facebook}`}
              id="Facebook"
              onClick={onClick}
            />
            <i className={`fa fa-twitter fa-3x ${styles.twitter}`} id="Twitter" onClick={onClick} />
            <i
              className={`fa fa-instagram fa-3x ${styles.instagram}`}
              id="Instagram"
              onClick={onClick}
            />
            <i className={`fa fa-youtube fa-3x ${styles.youtube}`} id="Youtube" onClick={onClick} />
            <i
              className={`fa fa-linkedin-square fa-3x ${styles.linkedin}`}
              id="Linkedin"
              onClick={onClick}
            />
            <div id="el" style={{ visibility: show ? 'visible' : 'hidden' }}>
              <label htmlFor="basic-url">{id} URL</label>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon3">
                    <i
                      className={`fa fa-${id.toLowerCase()} ${styles[id.toLowerCase()]}`}
                      style={{ margin: '0px' }}
                    />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  placeholder="https://example.com/"
                  id="basic-url"
                  aria-describedby="basic-addon3"
                />
              </InputGroup>
            </div>
          </div>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Fundraise;
