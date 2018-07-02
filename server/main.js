import { Meteor } from 'meteor/meteor';
import moment from 'moment';

import { Meets } from '../imports/api/meets';

// Source:
//   https://stackoverflow.com/questions/26247234/removing-mongo-entry-after-a-specific-set-of-time-in-a-meteor-application
let clear = () => {
  let DURATION = 3600*24*1000; // meets should last <24h
  let millis = moment(new Date(new Date() - DURATION)).valueOf();
  Meets.remove({
    createDate: {$lt: millis}
  });
};

if (Meteor.isServer) {
  Meteor.startup(() => {
    // Purge any meet created >24h ago
    clear();
    let INTERVAL = 3600/2*1000; // meet-purges conducted every half hour
    Meteor.setInterval(clear, INTERVAL);
  });
}

