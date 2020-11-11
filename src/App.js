// npm libs
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ReactQueryDevtools } from 'react-query-devtools';

// views or route components
import Landing from 'views/Landing';
import Login from 'views/Login';
import Claims from 'views/Claims';
import ClaimInfo from 'views/Claims/ClaimInfo';
import NonprofitSearch from 'views/Nonprofit/Search';
import Nonprofit from 'views/Nonprofit';
import InternalNonprofitCategories from 'views/Nonprofit/Categories';
import ForgotPassword from 'views/ForgotPassword';
import Banlist from 'views/Banlist';
import Users from 'views/Users';
import UserInfo from 'views/Users/UserInfo';
import ErrorPage from 'views/Error';
import NotFound from 'views/NotFound';
import BrandsGrooming from 'views/Brands/Grooming';
import CreateAdminUser from 'views/Users/CreateAdminUser';
import CreateBrandUser from 'views/Users/CreateBrandUser';
import CreateNonprofitUser from 'views/Users/CreateNonprofitUser';
import Settings from 'views/Settings';
import BrandsSearch from 'views/Brands/Search';
import DeleteUser from 'views/Users/DeleteUser';

// components|other
import PublicRoute from 'components/PublicRoute';
import PrivateRoute from 'components/PrivateRoute';
import { autoLogin } from 'actions/auth';
import BrandInfo from 'views/Brands/BrandInfo';
import Buckets from 'views/Brands/buckets';
import Spinner from 'components/Spinner';

const MatchUserInfo = ({ match, ...props }) =>
  <UserInfo {...props} {...match.params} />;

const App = ({ autoLogin, user, isLoading }) => {
  useEffect(() => {
    autoLogin();
  }, [autoLogin]);

  /**
   * Show spinner when processing the auto login
   */
  if (isLoading) {
    return (
      <div className="spinnerOverlay">
        <Spinner />
      </div>
    );
  }

  return (
    <Router>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      <Helmet>
        <title>Give Good Deeds</title>
      </Helmet>
      <Switch>
        {/* Public Routes */}
        <PublicRoute exact path="/" component={Landing} />
        <PublicRoute exact path="/login" component={Login} />
        <PublicRoute exact path="/forgot-password" component={ForgotPassword} />
        <PublicRoute exact path="/error" component={ErrorPage} />
        <PublicRoute exact path="/notfound" component={NotFound} />

        {/* Private Routes */}
        <PrivateRoute exact path="/banlist" component={Banlist} />
        <PrivateRoute exact path="/claims" component={Claims} />
        <PrivateRoute exact path="/claims/:id" component={ClaimInfo} />
        <PrivateRoute exact path="/nonprofit" component={NonprofitSearch} />
        <PrivateRoute exact path="/nonprofit/:id" component={Nonprofit} />
        <PrivateRoute exact path="/nonprofit-categories" component={InternalNonprofitCategories} />
        <PrivateRoute exact path="/brands/search" component={BrandsSearch} />
        <PrivateRoute exact path="/brands/grooming" component={BrandsGrooming} />
        <PrivateRoute exact path="/brands/buckets" component={Buckets} />
        <PrivateRoute exact path="/brands/:id" component={BrandInfo} />
        <PrivateRoute exact path="/users" component={Users} />
        <PrivateRoute exact path="/users/:type/:id" component={MatchUserInfo} />
        <PrivateRoute exact path="/users/admin" component={CreateAdminUser} />
        <PrivateRoute exact path="/users/brand" component={CreateBrandUser} />
        <PrivateRoute exact path="/users/nonprofit" component={CreateNonprofitUser} />
        <PrivateRoute exact path="/settings" component={Settings} />
        <PrivateRoute exact path="/delete-user" component={DeleteUser} />

        {/* 404 */}
        <PublicRoute path="*">
          <Redirect to="/notfound" />
        </PublicRoute>
      </Switch>
    </Router>
  );
};

App.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
  isLoading: state.auth.isLoading,
});

export default connect(mapStateToProps, { autoLogin })(App);
