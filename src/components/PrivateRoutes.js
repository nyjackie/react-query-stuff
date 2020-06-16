import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoutes = ({ children, isAuthenticated }) => (
  <Fragment>{isAuthenticated ? children : <Redirect to="/login" />}</Fragment>
);

PrivateRoutes.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(PrivateRoutes);
