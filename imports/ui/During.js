import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import React from 'react';
import { Session } from 'meteor/session';
import { TimeSync } from 'meteor/mizzao:timesync';

export default class During extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      started: false,
      currTime: '',
      timerClass: 'timeGreen'
    };
  }
  componentDidMount() {
    TimeSync.loggingEnabled = false; // prevents messages to client
    this.timeTracker = Tracker.autorun(() => {
      // calculate the time
      let serv = TimeSync.serverTime();
      let diff = (this.props.meet.createDate - moment(serv).valueOf())/1000; // seconds remaining
      if (!!diff) {
        let currTime = diff + this.props.meet.duration.hour*3600 + this.props.meet.duration.min*60;
        const formattedCurrTime = moment.utc(currTime*1000).format('HH:mm:ss'); // current time remaining
        this.setState({currTime: formattedCurrTime});
        // get class of timer
        if (currTime <= 120 && currTime > 10) {
          this.setState({timerClass: 'timeYellow'}); // green timer --> yellow timer
        } else if (currTime <= 10 && currTime > 0) {
          this.setState({timerClass: 'timeRed'}); // yellow timer --> red timer
        } else if (currTime <= 0 && currTime > -6) {
          this.setState({currTime: moment.utc(0).format('HH:mm:ss')});
          this.setState({timerClass: 'timeRed flash'}); // red timer --> flashing red timer at 00:00
        } else if (currTime <= -6) {
          this.endMeet();
        }
      }
    });
  }
  componentWillUnmount() {
    this.timeTracker.stop(); // we don't want to set the state every time the page is loaded
  }
  endMeet() {
    // send call to Created component through database to reclassify meet as 'ended'
    Meteor.call(
      'meets.end',
      { meetId: this.props.meet.meetId },
      (err) => {
        if (!err) {
          alert('Your meeting has ended!');
        } else {
          alert(err.reason);
          this.setState({error: err.reason})
        }
      }
    );
  }
  render() {
    return (
      <div className='container'>
        <div className='box'>
          <h1>During.js</h1>
        </div>

        <div className='box'>
          <h3>Copy/Share this link:</h3>
          <p>{window.location.href}</p>
          <h3>or this code:</h3>
          <p>{this.props.meet.meetId}</p>
        </div>

        <div className={`box ${this.state.timerClass}`}>
          <p>Time Remaining:</p>
          <p>{this.state.currTime}</p>
        </div>

        <div className='box'>
          Goals:
        </div>

        {/* bright, noticeable, clickable color & placement */}
        <button onClick={this.endMeet.bind(this)}>End Early!</button>
      </div>
    );
  }
};

