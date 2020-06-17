import React, { Fragment } from 'react';
import { Container, Row } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';

const ClaimsPage = () => {
  return (
    <Fragment>
      <PageHeader pageTitle="Claims Page" />
      <Container>
        <Row>
          <p>This is where claims page will be and it will be protected by auth</p>
        </Row>
      </Container>
    </Fragment>
  );
};

export default ClaimsPage;
