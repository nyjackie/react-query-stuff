import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../components/Spinner';

const PrivateRoutes = ({ children, auth: { isAuthenticated, loading } }) => (
  <Fragment>
    {loading ? <Spinner /> : isAuthenticated ? children : <Redirect to="/login" />}
  </Fragment>
);

PrivateRoutes.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoutes);
