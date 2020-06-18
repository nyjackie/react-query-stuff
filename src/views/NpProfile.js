import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { useParams, Redirect } from 'react-router-dom';
import PageHeader from 'components/PageHeader';
import { searchSelect } from 'actions/search';

const NonprofitProfile = ({ results }) => {
  let { ein } = useParams();

  // for now this depends on /search being performed first and state
  // containing results, eventually we'll also have to hit an API as well
  const selected = results.find(item => item.ein === ein);

  if (!results || results.length === 0) {
    return <Redirect to="/search" />;
  }

  return (
    <Fragment>
      <PageHeader pageTitle="Nonprofit Profile" />
      <Row>
        <Col>
          {Object.keys(selected).map((key, i) => {
            const curr = selected[key];
            return (
              <p key={`${curr.ein}-${i}`}>
                {key} - {curr}
              </p>
            );
          })}
        </Col>
      </Row>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  results: state.search.results,
});

export default connect(mapStateToProps, { searchSelect })(NonprofitProfile);
