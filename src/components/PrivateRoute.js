import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from './Spinner';

// src from react-router docs
// https://reacttraining.com/react-router/web/example/auth-workflow

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ component: Component, auth: { isAuthenticated, loading }, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        loading ? (
          <Spinner />
        ) : isAuthenticated ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(PrivateRoute);
