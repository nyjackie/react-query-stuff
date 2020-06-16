// npm libs
import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// views or route components
import Landing from './views/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

// components/other
import Navbar from './components/Navbar';
import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Helmet>
            <title>Good Deeds Data | Nonprofit Portal</title>
          </Helmet>
          <Container fluid className="d-flex flex-column h-100">
            <Row className="flex-fill">
              <Col className="nav-column" md={3}>
                <Navbar />
              </Col>
              <Col>
                <main>
                  <Switch>
                    {/* we should make an router page later for all the views */}
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/login" component={Login} />
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
