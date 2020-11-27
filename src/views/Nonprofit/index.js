import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import PageHeader from 'components/PageHeader';
import { setNotification } from 'actions/notifications';
import Profile from 'views/Nonprofit/ProfileEdit';
import { useNonprofit } from 'hooks/useNonprofits';
import UserInfoList from 'views/Users/UserInfoList';
import Spinner from 'components/Spinner';

/**
 * Nonprofit profile
 */
const Nonprofit = ({ setNotification }) => {
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
    return (
      <>
        <Helmet>
          <title>Nonprofit: {selected.name} | Give Good Deeds | Admin Portal</title>
        </Helmet>
        <Profile data={selected} />
        <UserInfoList ids={selected.users.map(({ id }) => id)} type="nonprofit" />
      </>
    );
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

export default connect(null, { setNotification })(Nonprofit);
