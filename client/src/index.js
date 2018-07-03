import 'bootstrap/dist/css/bootstrap.min.css';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

import { routes } from '../../imports/routes/routes';

Meteor.startup(() => {
  ReactDOM.render(routes, document.getElementById('appRoot'));
  registerServiceWorker();
});

