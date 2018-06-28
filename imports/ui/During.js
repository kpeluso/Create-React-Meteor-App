import React from 'react';
import { Session } from 'meteor/session';

export default class During extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timerClass: 'timeGreen' // maybe make session...?
    };
  }
  componentDidMount() {
    this.timeTracker = Tracker.autorun(() => {
      this.setState({timerClass: Session.get('timerClass')});
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
          <h1>During.js</h1>
        </div>

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
};

