import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import PageHeader from 'components/PageHeader';
import { search, saveProfile } from 'actions/nonprofits';
import Profile from 'views/Profile';

const Nonprofit = ({ results, isLoading, search, saveProfile }) => {
  const { ein } = useParams();

  const selected = results.find(item => item.ein === ein);

  // this will perform a search if nonprofit does not exist
  // in our local state
  useEffect(() => {
    if (!selected) {
      search(ein).catch(err => {
        console.log(err);
      });
    }
  }, [ein, search, selected]);

  function update(obj) {
    return saveProfile(obj);
  }

  if (!selected && !isLoading) {
    return (
      <Fragment>
        <PageHeader pageTitle="Nonprofit Profile" />
        <Row>
          <Col>
            <p>A profile for {ein} could not be found.</p>
            <p>
              <Link to="/search">Try searching again</Link>
            </p>
          </Col>
        </Row>
      </Fragment>
    );
  }

  if (selected) {
    return <Profile onSave={update} data={selected} />;
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

export default connect(mapStateToProps, { search, saveProfile })(Nonprofit);
