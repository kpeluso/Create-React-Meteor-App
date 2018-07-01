import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import { Meets } from '../imports/api/meets';

if (Meteor.isServer) {
  Meteor.startup(() => {
    //
    // PURGE ALL MEETINGS AFTER A DAY!
    //
  });
}

