import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import { Meets } from '../imports/api/meets';

if (Meteor.isServer) {
  Meteor.startup(() => {
    // WebApp.connectHandlers.use((req, res, next) => {
    //   const _id = req.url.slice(1); // strip initial '/'
    //   const meet = Meets.findOne({_id});
    //   if (meet) {
    //     res.statusCode = 302; // meaning that target resource is under different domain
    //     res.setHeader('Location', url+'/'+meet._id); // key-value pair
    //     res.end();
    //   } else {
    //     next();
    //   }
    // });

    //
    // PURGE ALL MEETINGS AFTER A DAY!
    //
  });
}

