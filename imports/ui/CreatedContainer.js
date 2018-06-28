import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';

import { Meets } from '../api/meets.js';

import After from './After.js';
import Created from './Created.js';
import During from './During.js';
import NotFound from './NotFound.js';

export default CreatedContainer = withTracker(({ meetId }) => {
  const meetsHandle = Meteor.subscribe('allMeets');
  const loading = !meetsHandle.ready();
  const meet = Meets.findOne({meetId});
  const meetExists = !loading && !!meet;
  const endTime = moment().add(60*meet.duration.hour + meet.duration.min, 'm')

  console.log('from container:');
  console.log(meet);

  if (!meetExists) {
    return <NotFound />
  } else {
    return {
      meet
    };
  }

})(Created);

