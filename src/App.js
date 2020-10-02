// npm libs
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
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
import store from 'store';
import { autoLogin } from 'actions/auth';
import BrandInfo from 'views/Brands/BrandInfo';

const queryConfig = {
  queries: {
    /**
     * This makes queries stale after 5 minutes instead of immediately
     */
    // staleTime: 1000 * 60 * 5,

    /**
     * our default should be no retries.
     */
    retry: false,
  },
};

/**
 * Public routes are declared this way because we don't have a custom component
 * for PublicRoutes, it's just the react-router-dom <Route /> component
 */
const publicRoutes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/error', component: ErrorPage },
  { path: '/notfound', component: NotFound },
];

function PrivateRoutes() {
  return (
    <>
      {/* Private Routes */}
      <PrivateRoute exact path="/banlist" component={Banlist} />
      <PrivateRoute exact path="/claims" component={Claims} />
      <PrivateRoute exact path="/claims/:id" component={ClaimInfo} />
      <PrivateRoute exact path="/nonprofit" component={NonprofitSearch} />
      <PrivateRoute exact path="/nonprofit/:id" component={Nonprofit} />
      <PrivateRoute exact path="/brands/search" component={BrandsSearch} />
      <PrivateRoute exact path="/brands/grooming" component={BrandsGrooming} />
      <PrivateRoute exact path="/brands/:id" component={BrandInfo} />
      <PrivateRoute exact path="/users" component={Users} />
      <PrivateRoute exact path="/users/:type/:id" component={UserInfo} />
      <PrivateRoute exact path="/users/admin" component={CreateAdminUser} />
      <PrivateRoute exact path="/users/brand" component={CreateBrandUser} />
      <PrivateRoute exact path="/users/nonprofit" component={CreateNonprofitUser} />
      <PrivateRoute exact path="/settings" component={Settings} />
      <PrivateRoute exact path="/delete-user" component={DeleteUser} />
    </>
  );
}

const App = () => {
  useEffect(() => {
    store.dispatch(autoLogin());
  }, []);

  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <Provider store={store}>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        <Router>
          <Switch>
            {publicRoutes.map(route => (
              <PublicRoute key={route.path} exact path={route.path} component={route.component} />
            ))}
            <PrivateRoutes />
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
