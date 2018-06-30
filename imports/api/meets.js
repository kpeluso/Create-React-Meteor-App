import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';
import shortid from 'shortid';
import SimpleSchema from 'simpl-schema';

export const Meets = new Mongo.Collection('meets');

if (Meteor.isServer) {
  Meteor.publish('allMeets', function() {
    return Meets.find();
  });
}

Meteor.methods({
  'meets.create'(meet) {
    try {
      new SimpleSchema({
        duration: Object,
        'duration.hour': Number,
        'duration.min': Number,
        goals: {
          type: Array,
          label: 'MEETING GOALS',
          minCount: 1,
          maxCount: 5
        },
        'goals.$': String,
        people: {
          type: Array,
          label: 'MEETING PARTICIPANTS\' NAMES',
          minCount: 2,
          maxCount: 10
        },
        'people.$': String,
        emails: {
          type: Array,
          label: 'MEETING PARTICIPANTS\' EMAILS',
          maxCount: 10
        },
        'emails.$': {
          type: SimpleSchema.RegEx.Email,
          optional: true
        }
      }).validate(meet);
    } catch (e) {
      throw new Meteor.Error(400,e.message);
    }
    const newId = shortid.generate();
    Meets.insert({
      meetId: newId,
      ...meet,
      createDate: moment().valueOf(),
      started: false,
      ended: false
    });
    return newId;
  },

  // 'meets.query'(meetId) {
  //   try {
  //     new SimpleSchema({
  //       meetId: {
  //         type: String,
  //         label: 'MEETING meetId',
  //         min: 1
  //       }
  //     }).validate(meetId);
  //   } catch (e) {
  //     throw new Meteor.Error(400,e.message);
  //   }
  //   return Meets.find({meetId: meetId}).fetch();
  // },

  'meets.start'(meetId) {
    try {
      new SimpleSchema({
        meetId: {
          type: String,
          label: 'A NEWLY STARTED MEETING meetId',
          min: 1
        }
      }).validate(meetId);
    } catch (e) {
      throw new Meteor.Error(400,e.message);
    }
    Meets.update(meetId, {
        $set: {started: true}
      }
    );
  },

  'meets.end'(meetId) {
    // triggered when meeting timer ends or when meeting ended early
    try {
      new SimpleSchema({
        meetId: {
          type: String,
          label: 'MEETING meetId',
          min: 1
        }
      }).validate(meetId);
    } catch (e) {
      throw new Meteor.Error(400,e.message);
    }
    Meets.update(meetId, {
        $set: {ended: true}
      }
    );
  },

  'meets.rm'(meetId) {
    // triggered when meeting timer ends or when meeting ended early
    try {
      new SimpleSchema({
        meetId: {
          type: String,
          label: 'MEETING meetId',
          min: 1
        }
      }).validate(meetId);
    } catch (e) {
      throw new Meteor.Error(400,e.message);
    }
    Meets.remove(meetId);
  }
});

