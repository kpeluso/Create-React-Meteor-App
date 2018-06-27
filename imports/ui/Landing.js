import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className='box'>
      Join a meeting: <input type='text' placeholder='e.g. Bymgw4yG7' />
      or
      <Link to={'/before'} className='button button--link'>Create a Meeting</Link>
    </div>
  );
};

export default Landing;

