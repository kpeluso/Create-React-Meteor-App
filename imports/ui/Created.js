import createHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import React from 'react';
import { Tracker } from 'meteor/tracker';

import { Meets } from '../api/meets';

import After from './After';
import During from './During';
import Loading from './Loading';

export default class Created extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: <Loading />
    };
  }

  componentDidMount() {
    this.meetTracker = Tracker.autorun(() => {
      const subHandle = Meteor.subscribe('allMeets');
      const loading = !subHandle.ready();

      const maybeMeet = Meets.find({meetId: this.props.meetId}).fetch();
      if (!maybeMeet.length && loading) {
        this.setState({active: <Loading />});
      } else if (!loading) {
        if (maybeMeet.length) {
          this.setState({active: <During meet={maybeMeet[0]} />});
        } else {
          createHistory().push('/PageNotFound');
          window.location.reload();
        }
      }

      console.log('from tracker in created:');
      console.log(this.props);
      console.log(this.state);

      // const diff = (moment().valueOf() - this.props.endTime.valueOf())/1000;
      // if (diff > -10 && diff < 0) {
      //   Session.set({timerClass: 'timeYellow'}); // green timer --> yellow timer
      // } else if (diff > 0 && diff < 5) {
      //   Session.set({timerClass: 'timeRed'}); // yellow timer --> flashing red timer at 00:00
      // } else if (diff > 5) {
      //   this.setState({active: <After />}); // <During /> --> <After />
      // }
    });
  }
  componentWillUnmount() {
    this.meetTracker.stop();
  }
  render() {
    return (
      <div className='container'>
        {this.state.active}
      </div>
    );
  }
}

