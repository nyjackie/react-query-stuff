import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import PageHeader from 'components/PageHeader';
import { addNotification } from 'actions/notifications';
import Profile from 'views/Nonprofit/Edit';
import { useNonprofit } from 'hooks/useNonprofits';
import NonprofitUser from 'views/Users/NonprofitUser';
import Spinner from 'components/Spinner';

/**
 * Nonprofit profile
 */
const Nonprofit = ({ addNotification }) => {
  const { id } = useParams();

  const nonp = useNonprofit(id);
  console.log(nonp.data);
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

  // TODO: WEB-191 details.
  // Make a UserInfoList component to handle lists of users in an accordion.
  if (selected) {
    return (
      <>
        <Helmet>
          <title>Nonprofit: {selected.name} | Give Good Deeds | Admin Portal</title>
        </Helmet>
        <Profile data={selected} />
        {selected.users?.length && selected.users.map(user => {
          return (
            <>
              <NonprofitUser data={user} />
            </>
          );
        })}
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

export default connect(null, { addNotification })(Nonprofit);
