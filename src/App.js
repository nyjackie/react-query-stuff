// npm libs
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ReactQueryDevtools } from 'react-query-devtools';
import { ReactQueryConfigProvider } from 'react-query';

// views or route components
import Landing from 'views/Landing';
import Login from 'views/Login';
import Claims from 'views/Claims';
import ClaimInfo from 'views/Claims/ClaimInfo';
import NonprofitSearch from 'views/Nonprofit/Search';
import Nonprofit from 'views/Nonprofit';
import ForgotPassword from 'views/ForgotPassword';
import Banlist from 'views/Banlist';
import Users from 'views/Users';
import UserInfo from 'views/Users/UserInfo';
import ErrorPage from 'views/Error';
import NotFound from 'views/NotFound';
import Brands from 'views/Brands';
import CreateUser from 'views/Account/CreateUser';
import Settings from 'views/Settings';

// components|other
import PublicRoute from 'components/PublicRoute';
import PrivateRoute from 'components/PrivateRoute';
import store from 'store';
import { autoLogin } from 'actions/auth';
import BrandInfo from 'views/Brands/BrandInfo';

const queryConfig = {
  queries: {
    /**
     * This makes queries stale after 5 minutes instead of immediately
     */
    staleTime: 1000 * 60 * 5,

    /**
     * our default should be no retries.
     */
    retry: false,
  },
};

const App = () => {
  useEffect(() => {
    store.dispatch(autoLogin());
  }, []);

  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <Provider store={store}>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        <Router>
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
            <PrivateRoute exact path="/brands/" component={Brands} />
            <PrivateRoute exact path="/brands/:ein" component={BrandInfo} />
            <PrivateRoute exact path="/users" component={Users} />
            <PrivateRoute exact path="/users/:type/:id" component={UserInfo} />
            <PrivateRoute exact path="/account/create" component={CreateUser} />
            <PrivateRoute exact path="/settings" component={Settings} />

            {/* 404 */}
            <PublicRoute path="*">
              <Redirect to="/notfound" />
            </PublicRoute>
          </Switch>
        </Router>
      </Provider>
    </ReactQueryConfigProvider>
  );
};

export default App;
