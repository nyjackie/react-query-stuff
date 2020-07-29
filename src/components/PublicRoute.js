import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Layout from 'components/Layout';

const PublicRoute = ({ component: Component, error, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (props.location.pathname !== '/error' && error.error && !error.seen) {
          // redirect to the error page only once per error
          return <Redirect to="/error" />;
        }

        return (
          <Layout>
            <Component {...props} />
          </Layout>
        );
      }}
    />
  );
};

const mapStateToProps = state => ({
  error: state.error,
});

export default connect(mapStateToProps)(PublicRoute);
