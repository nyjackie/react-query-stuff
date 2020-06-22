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

const Layout = ({ children, drawerOpen, toggleDrawer, isLoading }) => {
  const drawerCSS = ['flex-fill', 'bg-dark', styles.transition, styles.drawer];
  if (!drawerOpen) {
    drawerCSS.push(styles.closed);
  }
  const contentCSS = ['flex-column', 'd-flex', styles.transition, styles.content];
  if (drawerOpen) {
    contentCSS.push(styles.push);
  }

  return (
    <Fragment>
      <Spinner show={isLoading} />
      <Container fluid className="d-flex flex-column h-100">
        <h1 className="sr-only">Good Deeds Data admin portal</h1>
        <Row className="h-100 position-relative">
          <Col id="drawer" className={drawerCSS.join(' ')}>
            <SideNav />
          </Col>
          <Col className={contentCSS.join(' ')}>
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
