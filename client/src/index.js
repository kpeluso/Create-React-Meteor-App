import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './app.js';
import registerServiceWorker from './registerServiceWorker';

import { routes } from '../../imports/routes/routes';

// const Index = () => {
//   return (
//     <div id='root'>
//       <App />
//     </div>
//   )
// }

Meteor.startup(() => {

  //ReactDOM.render(<Index/>, document.querySelector('.container'));

  ReactDOM.render(routes, document.getElementById('appRoot'));
  registerServiceWorker();
});

