import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from 'actions/auth';
import { Container, Row } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';

const Landing = ({ auth: { isAuthenticated, loading }, logout }) => {
  const guestLinks = <h2>Please Login or Sign Up</h2>;
  const authLinks = (
    <div>
      <button onClick={logout} href="#!" className="btn btn-primary">
        Logout
      </button>
      <p>Login Success</p>
    </div>
  );
  return (
    <Fragment>
      <PageHeader pageTitle="Welcome to Good Deeds Data Nonprofit!" hideBack />
      <Container>
        <Row>{isAuthenticated ? authLinks : guestLinks}</Row>
      </Container>
    </Fragment>
  );
};

Landing.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Landing);
