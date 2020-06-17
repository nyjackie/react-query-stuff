import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { logout } from 'actions/auth';

const Navbar = ({ isAuthenticated, logout }) => {
  return (
    <div className="vertical-menu">
      <NavLink to="/" className="btn btn-primary" exact={true}>
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
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(Navbar);
