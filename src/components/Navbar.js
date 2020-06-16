import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="vertical-menu">
      <NavLink to="/" className="btn btn-primary" exact={true}>
        Home
      </NavLink>
      <NavLink to="/login" className="btn btn-primary">
        Login
      </NavLink>
      <NavLink to="/register" className="btn btn-primary">
        Register
      </NavLink>
    </div>
  );
};

export default Navbar;
