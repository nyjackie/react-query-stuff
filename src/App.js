// npm libs
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ReactQueryDevtools } from 'react-query-devtools';

// views or route components
import Landing from 'views/Landing';
import Login from 'views/Login';
import Claims from 'views/Claims';
import ClaimInfo from 'views/Claims/ClaimInfo';
import NonprofitSearch from 'views/Nonprofit/Search';
import Nonprofit from 'views/Nonprofit';
import ResetPassword from 'views/ResetPassword';
import Banlist from 'views/Banlist';
import Users from 'views/User';
import UserInfo from 'views/User/UserInfo';

// components|other
import PublicRoute from 'components/PublicRoute';
import PrivateRoute from 'components/PrivateRoute';
import store from 'store';
import { autoLogin } from 'actions/auth';

const App = () => {
  useEffect(() => {
    store.dispatch(autoLogin());
  }, []);

  return (
    <Provider store={store}>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      <Router>
        <Helmet>
          <title>Good Deeds Data | Admin Portal</title>
        </Helmet>
        <Switch>
          {/* Public Routes */}
          <PublicRoute exact path="/" component={Landing} />
          <PublicRoute exact path="/login" component={Login} />
          <PublicRoute exact path="/reset-password" component={ResetPassword} />

          {/* Private Routes */}
          <PrivateRoute exact path="/banlist" component={Banlist} />
          <PrivateRoute exact path="/claims" component={Claims} />
          <PrivateRoute exact path="/claims/:id" component={ClaimInfo} />
          <PrivateRoute exact path="/nonprofit" component={NonprofitSearch} />
          <PrivateRoute exact path="/nonprofit/:ein" component={Nonprofit} />
          <PrivateRoute exact path="/users" component={Users} />
          <PrivateRoute exact path="/users/:id" component={UserInfo} />

          {/* 404 and other */}
          <Route path="*">
            <h2>404</h2>
            <p>This page does not exist</p>
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
