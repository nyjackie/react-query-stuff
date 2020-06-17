import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from 'actions/auth';
import Nav from 'react-bootstrap/Nav';
import { closeDrawer } from 'actions/ui';

const SideNav = ({ isAuthenticated, logout, closeDrawer }) => {
  function onNavClick(e) {
    if (e.target.classList.contains('js-closeDrawer')) {
      closeDrawer();
    }
  }

  return (
    <Nav className="flex-column h-100" onClick={onNavClick}>
      <NavLink className="js-closeDrawer" to="/" exact={true}>
        Home
      </NavLink>
      {isAuthenticated && (
        <button onClick={logout} className="js-closeDrawer btn btn-link">
          Logout
        </button>
      )}
      {!isAuthenticated && (
        <NavLink to="/login" className="js-closeDrawer">
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
