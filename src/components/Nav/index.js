import React from 'react';
import { connect } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { logout } from 'actions/auth';
import Nav from 'react-bootstrap/Nav';
import { closeDrawer } from 'actions/ui';
import { ReactComponent as Logo } from 'assets/good-deeds-logo-teal.svg';
import styles from './Nav.module.scss';

const Title = () => (
  <a aria-hidden="true" href="/" className="mb-3">
    <Logo className={styles.logo} />
  </a>
);

const SideNav = ({ isAuthenticated, logout, closeDrawer }) => {
  let history = useHistory();

  function onNavClick(e) {
    if (e.target.classList.contains('js-closeDrawer')) {
      closeDrawer();
    }
  }

  function doLogout() {
    logout();
    history.push('/');
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
      <NavLink className="js-closeDrawer mb-2" to="/" exact={true}>
        Home
      </NavLink>
      <NavLink className="js-closeDrawer mb-2" to="/nonprofit" exact={true}>
        Search Nonprofits
      </NavLink>
      <NavLink className="js-closeDrawer mb-2" to="/users" exact={true}>
        Search Users
      </NavLink>
      <NavLink className="js-closeDrawer mb-2" to="/claims" exact={true}>
        Claims
      </NavLink>
      <NavLink className="js-closeDrawer mb-2" to="/brands" exact={true}>
        Brand Offers
      </NavLink>
      <NavLink className="js-closeDrawer mb-2" to="/banlist" exact={true}>
        Ban List
      </NavLink>
      <button onClick={doLogout} className="js-closeDrawer mt-5 btn btn-secondary">
        Logout
      </button>
    </Nav>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout, closeDrawer })(SideNav);
