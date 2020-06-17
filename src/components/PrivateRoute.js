import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from './Spinner';

// src from react-router docs
// https://reacttraining.com/react-router/web/example/auth-workflow

const PrivateRoute = ({ isAuthenticated, loading, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      loading ? (
        <Spinner />
      ) : isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  component: PropTypes.elementType.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
