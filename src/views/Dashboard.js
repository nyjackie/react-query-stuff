import React, { Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';

const Dashboard = () => {
  return (
    <Fragment>
      <PageHeader
        className="text-primary"
        pageTitle="Dashboard **THIS SHOULD APPEAR AFTER LOGIN**"
      />
      <Container>
        <h2>Replace Home page?</h2>
        <Container fluid="lg" className="dashboard">
          <Row>
            <Col> Admin page </Col>
          </Row>
        </Container>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
