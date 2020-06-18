import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout } from 'actions/auth';
import { Row } from 'react-bootstrap';
import PageHeader from 'components/PageHeader';

const Landing = ({ auth: { isAuthenticated }, logout }) => {
  const guestLinks = (
    <h2>
      Please{' '}
      <NavLink to="/login" className="js-closeDrawer mb-2">
        Login
      </NavLink>
    </h2>
  );
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
      <PageHeader pageTitle="Admin" hideBack />
      <Row>{isAuthenticated ? authLinks : guestLinks}</Row>
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
