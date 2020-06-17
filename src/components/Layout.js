import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { toggleDrawer } from 'actions/ui';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import SideNav from 'components/Nav';

const Layout = ({ children, drawerOpen, toggleDrawer }) => {
  return (
    <Fragment>
      <Container fluid className="d-flex flex-column h-100">
        <Row className="h-100">
          <Col id="drawer" className={`bg-dark ${!drawerOpen && 'collapse'}`} xs={6} md={3}>
            <SideNav />
          </Col>
          <Col className="flex-column d-flex">
            <Navbar bg="light" expand="md">
              <Navbar.Toggle aria-controls="drawer" onClick={toggleDrawer} />
              <Navbar.Brand href="/">Good Deeds Data | Admin</Navbar.Brand>
            </Navbar>
            <main className="flex-fill">{children}</main>
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
});

export default connect(mapStateToProps, { toggleDrawer })(Layout);
