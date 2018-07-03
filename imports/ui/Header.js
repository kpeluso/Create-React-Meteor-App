import createHistory from 'history/createBrowserHistory';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import React from 'react';

const Header = () => {
  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand onClick={() => {
        createHistory().replace('/');
        window.location.reload();}}>Meetr</NavbarBrand>
      <Nav className="ml-auto" navbar>
        <NavItem>
          <NavLink href='http://kennyp.herokuapp.com/' target="_blank">by Kenny</NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default Header;

