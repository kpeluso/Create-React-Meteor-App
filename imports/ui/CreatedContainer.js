// import { Meteor } from 'meteor/meteor';
// import moment from 'moment';
// import { withTracker } from 'meteor/react-meteor-data';
// import React from 'react';
//
// import { Meets } from '../api/meets.js';
//
// import After from './After.js';
// import Created from './Created.js';
// import During from './During.js';
// import Loading from './Loading.js';
//
// export default CreatedContainer = withTracker(({ meetId }) => {
//   const meetsHandle = Meteor.subscribe('allMeets');
//   const loading = !meetsHandle.ready();
//   const meet = Meets.findOne({meetId});
//   const meetExists = !loading && !!meet;
//
//   const endTime = !loading ? moment().add(60*meet.duration.hour + meet.duration.min, 'm') : moment()
//
//   console.log('from container:');
//   console.log(meet);
//   console.log(endTime);
//
//   if (!meetExists || !endTime) {
//     return <Loading />
//   } else {
//     return {
//       meet,
//       endTime
//     };
//   }
//
// })(Created);
//
