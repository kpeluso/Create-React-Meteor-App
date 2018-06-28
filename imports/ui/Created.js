import {Meteor} from 'meteor/meteor';
import moment from 'moment';
import React from 'react';

import { Meets } from '../api/meets';

import After from './After';
import During from './During';

export default class Created extends React.Component {
  constructor(props) {
    super(props);
    Meteor.subscribe('allMeets');
    this.state = {
      endTime: undefined,
      timerClass: 'timeGreen',
      active: <During />
    };
  }
  componentDidMount() {
    this.timeTracker = Tracker.autorun(() => {
      const diff = (moment().valueOf() - this.state.endTime.valueOf())/1000;
      if (diff > -10 && diff < 0) {
        this.setState({timerClass: 'timeYellow'}); // green timer --> yellow timer
      } else if (diff > 0 && diff < 5) {
        this.setState({timerClass: 'timeRed'}); // yellow timer --> flashing red timer at 00:00
      } else if (diff > 5) {
        this.setState({active: <After />}); // <During /> --> <After />
      }
    });
  }
  componentWillUnmount() {
    this.timeTracker.stop(); // we don't want to set the state every time the page is loaded
  }
  timer() {
    return (
      <div className={`box ${this.state.timerClass}`}>
        <p>Time Remaining:</p>
        <p>{moment().to(this.state.endTime)}</p>
        {/* <p>{`${this.state.endTime}:${__}:${__}`}</p> */}
      </div>
    );
  }
  render() {
    return (
      <div className='container'>
        <div className='box'>
          <h3>Copy/Share this link:</h3>
          <p>{window.location.href}</p>
          <h3>or this code:</h3>
          <p>{this.props.meetId}</p>
        </div>

        {this.timer()}

        <div className='box'>
          Goals:
        </div>

        {/* bright, noticeable, clickable color & placement */}
        <button>End Early!</button>
      </div>
    );
  }
}

