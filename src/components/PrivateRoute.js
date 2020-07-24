import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'components/Spinner';
import Layout from 'components/Layout';

// help from react-router docs
// https://reacttraining.com/react-router/web/example/auth-workflow

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
function PrivateRoute({ component: Component, auth: { isAuthenticated, isLoading }, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthenticated) {
          return (
            <Layout>
              <Component {...props} />
            </Layout>
          );
        } else if (isLoading) {
          return <Spinner fullPage={true} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  component: PropTypes.elementType.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
