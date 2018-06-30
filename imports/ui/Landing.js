import createHistory from 'history/createBrowserHistory';
import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className='box'>
      Join a meeting:
      <form method='post' onSubmit={(evt) => {
          createHistory().push('/meet?m='+evt.target.id.value);
          window.location.reload();
        }
      }>
        <input type='text' name='id' placeholder='e.g. Bymgw4yG7' />
        <button type='submit'>Go to Meeting</button>
      </form>
      or
      <Link to={'/before'} className='button button--link'>Create a Meeting</Link>
    </div>
  );
};

export default Landing;

