import { Email } from 'meteor/email';
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
      // validate whole meet object
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
        'goals.$': Object,
        'goals.$.statement': String,
        people: {
          type: Array,
          label: 'MEETING PARTICIPANTS\' NAMES',
          minCount: 2,
          maxCount: 10
        },
        'people.$': Object,
        'people.$.name': String,
        'people.$.email': String
      }).validate(meet);
    } catch (e) {
      throw new Meteor.Error(400,e.message);
    }
    // validate goals property
    try {
      new SimpleSchema({
        'statement': {
          label: 'MEETING.GOAL',
          type: String
        }
      }).validate(meet.goals);
    } catch (e) {
      throw new Meteor.Error(400,e.message);
    }
    // validate people property
    try {
      new SimpleSchema({
        'name': {
          label: 'MEETING.PEOPLE.NAME',
          type: String
        },
        'email': {
          label: 'MEETING.PEOPLE.EMAIL',
          type: SimpleSchema.RegEx.Email,
          optional: true
        }
      }).validate(meet.people);
    } catch (e) {
      throw new Meteor.Error(400,e.message);
    }
    // insert meet into collection
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
          label: 'MEETING RM meetId',
          min: 1
        }
      }).validate(meetId);
    } catch (e) {
      throw new Meteor.Error(400,e.message);
    }
    const rm = {};
    rm.meetId = meetId;
    // const meet = Meets.findOne(rm);
    // const text = meetId_Text.text;
    // const createdAt = moment(meet.createDate).format('MMM DD h:mm A');
    // process.env.MAIL_URL = "smtp://postmaster@sandboxfebb3b1caf1e4c6b80c530f3d1f9a0f4.mailgun.org:028f545ed9766f49f92bb270689d766f-e44cc7c1-9c8a3d1b@smtp.mailgun.org:587";
    // this.unblock(); // lets client run before emails finish sending
    // Email.send({
    //   to: meet.people.map(person => person.email),
    //   from: "no-reply@email.com",
    //   subject: "Meetr Receipt: Meeting "+meetId_Text.meetId+" created "+createdAt,
    //   ...text
    // });
    Meets.remove(rm);
  }
});

