import React, { Fragment } from 'react';
import { Row } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';

const ClaimsPage = () => {
  return (
    <Fragment>
      <PageHeader pageTitle="Claims Page" />
      <Row>
        <p>This is where claims page will be and it will be protected by auth</p>
      </Row>
    </Fragment>
  );
};

export default ClaimsPage;
