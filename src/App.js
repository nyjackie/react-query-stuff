// npm libs
import React, { Fragment, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// views or route components
import Landing from 'views/Landing';
import Register from 'views/Register';
import Login from 'views/Login';
import Claims from 'views/Claims';
import Dashboard from 'views/Dashboard';

// components/other
import Navbar from 'components/Navbar';
import PrivateRoute from 'components/PrivateRoute';
import store from 'store';
import { loadUser } from './actions/auth';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Helmet>
            <title>Good Deeds Data | Admin Portal</title>
          </Helmet>
          <Container fluid className="d-flex flex-column h-100">
            <Row className="flex-fill">
              <Col className="nav-column" md={3}>
                <Navbar />
              </Col>
              <Col>
                <main>
                  <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/login" component={Login} />
                    <PrivateRoute exact path="/claims" component={Claims} />
                    <PrivateRoute exact path="/dashboard" component={Dashboard} />
                  </Switch>
                </main>
              </Col>
            </Row>
            <footer>
              <p>&copy; Good Deeds Data</p>
            </footer>
          </Container>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
