import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import React from 'react';
import { Tracker } from 'meteor/tracker';

import { Meets } from '../api/meets';

import After from './After';
import During from './During';

export default class Created extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: <During endTime={this.props.endTime} meetId={this.props.meetId}/>
    };
  }

  componentDidMount() {
    this.timeTracker = Tracker.autorun(() => {

      console.log('from tracker in created:');
      console.log(this.props);

      const diff = (moment().valueOf() - this.props.endTime.valueOf())/1000;
      if (diff > -10 && diff < 0) {
        Session.set({timerClass: 'timeYellow'}); // green timer --> yellow timer
      } else if (diff > 0 && diff < 5) {
        Session.set({timerClass: 'timeRed'}); // yellow timer --> flashing red timer at 00:00
      } else if (diff > 5) {
        this.setState({active: <After />}); // <During /> --> <After />
      }
    });
  }
  componentWillUnmount() {
    this.timeTracker.stop();
  }
  render() {
    return (
      <div className='container'>
        {this.state.active}
      </div>
    );
  }
}

