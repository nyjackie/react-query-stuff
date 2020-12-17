import React from 'react';
import { Helmet } from 'react-helmet';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const AffliateTransactions = ({ history, location }) => {
  return (
    <>
      <Helmet>
        <title>Affliate Transactions | Admin Portal | Give Good Deeds</title>
      </Helmet>
      <Container className="block shadow-sm">
        <Row>
          <Col>
            <SearchInput history={history} location={location} />
          </Col>
        </Row>
        <Row>
          <SearchResults location={location} />
        </Row>
      </Container>
    </>
  );
};

export default AffliateTransactions;
