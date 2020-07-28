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
 * If a `selected` item lives in redux state it will use that to populate the
 * date, if not it will search our api using the ein in the url parameter
 */
const Nonprofit = ({ addNotification }) => {
  const { ein } = useParams();

  const { isLoading, isError, data: selected, error } = useNonprofit(ein);

  if (isLoading) {
    return <Spinner fullPage={true} />;
  }

  if (!isError) {
    return (
      <Fragment>
        <PageHeader pageTitle="Nonprofit Profile" />
        <Row>
          <Col>
            <p>A profile for {ein} could not be found.</p>
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
    return <Profile onSave={data => console.log('perform save', data)} data={selected} />;
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

const mapStateToProps = state => ({
  results: state.nonprofits.results,
  isLoading: state.loading.isLoading,
});

export default connect(mapStateToProps, { addNotification })(Nonprofit);
