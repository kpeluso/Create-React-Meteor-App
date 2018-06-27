import createHistory from 'history/createBrowserHistory';
// import { Link } from 'react-router-dom';
import React from 'react';

const Header = () => {
  return (
    <div className='header'>
      <div className='header__content'>
        <a onClick={() => {
          createHistory().replace('/');
          window.location.reload();
        }}><h1 className='header__title'>Meetr</h1></a>
        <span>by Kenny</span>
        <a href='http://kennyp.herokuapp.com/' target="_blank"><h1 className='header__title'>by Kenny</h1></a>
        {/* <button
          className='button button--link-text'
          onClick={() => {
            createHistory().replace('/');
          }
        }>Logout</button> */}
      </div>
    </div>
  );
};

export default Header;

