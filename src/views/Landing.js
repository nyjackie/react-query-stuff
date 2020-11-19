import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout } from 'actions/auth';

const Landing = ({ auth: { isAuthenticated }, logout }) => {
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  // if logged in defaulting to /claims
  return <Redirect to="/claims/pending" />;
};

Landing.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Landing);
