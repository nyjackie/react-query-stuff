// npm libs
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// views or route components
import Landing from 'views/Landing';
import Login from 'views/Login';
import Claims from 'views/Claims/Claims';
import Dashboard from 'views/Dashboard';
import ClaimInfo from 'views/Claims/ClaimInfo';
import Search from 'views/Search';
import Nonprofit from 'views/Nonprofit';
import Fundraise from 'views/Fundraise';
import Users from 'views/User';


// components/other
import Layout from 'components/Layout';
import PrivateRoute from 'components/PrivateRoute';
import store from 'store';
import { loadUser } from './actions/auth';

const App = props => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Helmet>
          <title>Good Deeds Data | Admin Portal</title>
        </Helmet>
        <Layout>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/fundraise" component={Fundraise} />
            <PrivateRoute exact path="/claims" component={Claims} />
            <PrivateRoute exact path="/claims/:id" component={ClaimInfo} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/search" component={Search} />
            <PrivateRoute exact path="/nonprofit/:ein" component={Nonprofit} />
            <PrivateRoute exact path="/users" component={Users} />
          </Switch>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;
