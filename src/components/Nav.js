import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from 'actions/auth';
import Nav from 'react-bootstrap/Nav';
import { closeDrawer } from 'actions/ui';

const SideNav = ({ isAuthenticated, logout, closeDrawer }) => {
  function onNavClick(e) {
    console.log(e);
  }

  return (
    <Nav className="flex-column" onClick={onNavClick}>
      <NavLink to="/" exact={true}>
        Home
      </NavLink>
      {isAuthenticated && (
        <button onClick={logout} href="#!" className="btn btn-primary">
          Logout
        </button>
      )}
      {!isAuthenticated && (
        <NavLink to="/login" className="btn btn-primary">
          Login
        </NavLink>
      )}
    </Nav>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout, closeDrawer })(SideNav);
