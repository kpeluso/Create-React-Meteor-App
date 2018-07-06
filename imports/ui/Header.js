import createHistory from 'history/createBrowserHistory';
import { Container, Navbar, NavbarBrand, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';

import React from 'react';

const Header = () => {
  return (
    <Navbar color="light" light expand="md">
      <div className='navWrapper'>
        <NavbarBrand onClick={() => {
          createHistory().replace('/');
          window.location.reload();}}>Meetr</NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href='http://kennyp.herokuapp.com/' target="_blank">by Kenny</NavLink>
          </NavItem>
        </Nav>
      </div>
    </Navbar>
  );
};

export default Header;

