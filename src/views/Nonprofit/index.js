import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import PageHeader from 'components/PageHeader';
import { addNotification } from 'actions/notifications';
import Profile from 'views/Nonprofit/Edit';
import { useNonprofit } from 'hooks/useNonprofits';
import Spinner from 'components/Spinner';

/**
 * Nonprofit profile
 */
const Nonprofit = ({ addNotification }) => {
  const { id } = useParams();

  const { isLoading, isError, data: selected, error } = useNonprofit(id);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <Fragment>
        <PageHeader pageTitle="Nonprofit Profile" />
        <Row>
          <Col>
            <p>A profile for {id} could not be found.</p>
            <p>{error.message}</p>
            <p>
              <Link to="/nonprofit">Try searching again</Link>
            </p>
          </Col>
        </Row>
      </Fragment>
    );
  }

  if (selected) {
    return <Profile data={selected} />;
  }

  return (
    <Fragment>
      <PageHeader pageTitle="Nonprofit Profile" />
      <Row>
        <Col>
          <p>Loading...</p>
        </Col>
      </Row>
    </Fragment>
  );
};

export default connect(null, { addNotification })(Nonprofit);
