import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { toggleDrawer } from 'actions/ui';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import SideNav from 'components/Nav';
import Spinner from 'components/Spinner';
import styles from './Layout.module.scss';
import Notification from 'components/Notification';
import { useLocation } from 'react-router-dom';
import { cn } from 'gdd-components/dist/utils';

const noNav = ['/login'];

const Layout = ({ children, drawerOpen, toggleDrawer, isLoading }) => {
  const location = useLocation();

  if (noNav.includes(location.pathname)) {
    return (
      <Fragment>
        <Spinner show={isLoading} />
        <Notification />
        <Container fluid className="d-flex flex-column h-100">
          <Row className="h-100 position-relative">
            <Col>
              <main className="flex-fill container-fluid">{children}</main>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }

  const drawerCSS = cn(
    'flex-fill',
    'bg-dark',
    styles.transition,
    styles.drawer,
    !drawerOpen && styles.closed
  );
  const contentCSS = cn(
    'flex-column',
    'd-flex',
    styles.transition,
    styles.content,
    drawerOpen && styles.push
  );

  return (
    <Fragment>
      <Spinner show={isLoading} />

      <Notification />
      <Container fluid className="d-flex flex-column h-100">
        <h1 className="sr-only">Good Deeds Data admin portal</h1>
        <Row className="h-100 position-relative">
          <Col id="drawer" className={drawerCSS}>
            <SideNav />
          </Col>
          <Col className={contentCSS}>
            <Navbar bg="light" expand="md" className="p-0 pt-2">
              <Navbar.Toggle aria-controls="drawer" onClick={toggleDrawer} />
            </Navbar>
            <main className="flex-fill container-fluid">{children}</main>
            <footer>
              <p>&copy; Good Deeds Data</p>
            </footer>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  drawerOpen: state.ui.drawerOpen,
  isLoading: state.loading.isLoading,
});

export default connect(mapStateToProps, { toggleDrawer })(Layout);
