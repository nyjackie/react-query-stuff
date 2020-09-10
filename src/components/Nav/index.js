import React from 'react';
import { connect } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import { closeDrawer } from 'actions/ui';
import { ReactComponent as Logo } from 'assets/good-deeds-logo-white.svg';
import styles from './Nav.module.scss';
import { useAuthState } from 'contexts/auth-context';

const Title = () => (
  <a aria-hidden="true" href="/" className="mb-sm-2 mb-md-3 d-block">
    <Logo className={styles.logo} />
  </a>
);

const SideNav = ({ closeDrawer }) => {
  const { isAuthenticated, logout } = useAuthState();
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
        <NavLink className="js-closeDrawer" to="/" exact={true}>
          Home
        </NavLink>
        <NavLink to="/login" className="js-closeDrawer">
          Login
        </NavLink>
      </Nav>
    );
  }

  return (
    <Nav
      role="navigation"
      aria-label="Main"
      id="nav"
      className={`flex-column h-100 ${styles.nav}`}
      onClick={onNavClick}
    >
      <Title />
      <ul className={styles.navUL}>
        <li className={`${styles.navSection} ${styles.noSub}`}>
          <NavLink className="js-closeDrawer" to="/" exact={true}>
            Home
          </NavLink>
        </li>
        <li className={`${styles.navSection} ${styles.noSub}`}>
          <NavLink className="js-closeDrawer" to="/settings" exact={true}>
            <i className="fa fa-gear" /> Settings
          </NavLink>
        </li>
        <li className={styles.navSection}>
          <h2>Nonprofits</h2>
          <ul className={styles.navSubSection}>
            <li>
              <NavLink className="js-closeDrawer" to="/nonprofit" exact={true}>
                Search
              </NavLink>
            </li>
            <li>
              <NavLink className="js-closeDrawer" to="/claims" exact={true}>
                Claims
              </NavLink>
            </li>
            <li>
              <NavLink className="js-closeDrawer" to="/banlist" exact={true}>
                Banned
              </NavLink>
            </li>
          </ul>
        </li>
        <li className={styles.navSection}>
          <h2>Users</h2>
          <ul className={styles.navSubSection}>
            <li>
              <NavLink className="js-closeDrawer" to="/users" exact={true}>
                Search
              </NavLink>
            </li>
          </ul>
        </li>

        <li className={styles.navSection}>
          <h2>Brands</h2>
          <ul className={styles.navSubSection}>
            <li>
              <NavLink className="js-closeDrawer" to="/brands" exact={true}>
                Grooming Queue
              </NavLink>
            </li>
          </ul>
        </li>

        <li className={styles.navSection}>
          <h2>Accounts</h2>
          <ul className={styles.navSubSection}>
            <li>
              <NavLink className="js-closeDrawer" to="/account/create" exact={true}>
                Create user
              </NavLink>
            </li>
          </ul>
        </li>

        <li className={`${styles.navSection} ${styles.noSub}`}>
          <button onClick={doLogout} className="js-closeDrawer btn btn-primary">
            Logout
          </button>
        </li>
      </ul>
    </Nav>
  );
};

export default connect(null, { closeDrawer })(SideNav);
