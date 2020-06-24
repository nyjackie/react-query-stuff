import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from 'actions/auth';
import Nav from 'react-bootstrap/Nav';
import { closeDrawer } from 'actions/ui';

const Title = () => (
  <a aria-hidden="true" href="/" className="mb-3">
    Good Deeds Data | Admin
  </a>
);

const SideNav = ({ isAuthenticated, logout, closeDrawer }) => {
  function onNavClick(e) {
    if (e.target.classList.contains('js-closeDrawer')) {
      closeDrawer();
    }
  }

  if (!isAuthenticated) {
    return (
      <Nav className="flex-column h-100 p-3" onClick={onNavClick}>
        <Title />
        <NavLink className="js-closeDrawer mb-2" to="/" exact={true}>
          Home
        </NavLink>
        <NavLink to="/login" className="js-closeDrawer mb-2">
          Login
        </NavLink>
      </Nav>
    );
  }

  return (
    <Nav className="flex-column h-100 p-3" onClick={onNavClick}>
      <Title />
      <NavLink className="js-closeDrawer mb-2" to="/dashboard" exact={true}>
        Home
      </NavLink>
      <NavLink className="js-closeDrawer mb-2" to="/search" exact={true}>
        Search
      </NavLink>
      <NavLink className="js-closeDrawer mb-2" to="/claims" exact={true}>
        Claims
      </NavLink>
      <NavLink className="js-closeDrawer mb-2" to="/fundraise" exact={true}>
        Fundraising Tool
      </NavLink>
      <button onClick={logout} className="js-closeDrawer mb-2 btn btn-link btn-link-reset">
        Logout
      </button>
    </Nav>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout, closeDrawer })(SideNav);
