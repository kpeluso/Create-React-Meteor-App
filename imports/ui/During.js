import moment from 'moment';
import React from 'react';
import { Session } from 'meteor/session';
import { TimeSync } from 'meteor/mizzao:timesync';

export default class During extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currTime: 0,
      timerClass: 'timeGreen',
      startTime: moment().valueOf()//.add(60*this.props.meet.duration.hour + this.props.meet.duration.min, 'm')
    };
  }
  componentDidMount() {
    TimeSync.loggingEnabled = false; // prevents messages to client
    this.timeTracker = Tracker.autorun(() => {
      // calculate the time
      let serv = TimeSync.serverTime();
      let diff = (this.state.startTime - moment(serv).valueOf())/1000; // seconds remaining
      if (!!diff) {
        let currTime = this.props.meet.duration.hour*3600 + this.props.meet.duration.min*60 + diff;
        const formattedCurrTime = moment.utc(currTime*1000).format('HH:mm:ss'); // current time remaining
        this.setState({currTime: formattedCurrTime});
        // get class of timer
        if (diff >= -10 && diff < 0) {
          this.setState({timerClass: 'timeYellow'}); // green timer --> yellow timer
        } else if (diff >= 0 && diff < 5) {
          this.setState({timerClass: 'timeRed'}); // yellow timer --> flashing red timer at 00:00
        } else if (diff >= 5) {
          this.setState({active: <After />}); // <During /> --> <After />
        }
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
        <p>{this.state.currTime}</p>
      </div>
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

        {this.timer()}

        <div className='box'>
          Goals:
        </div>

        {/* bright, noticeable, clickable color & placement */}
        <button>End Early!</button>
      </div>
    );
  }
};

