import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Session } from 'meteor/session';
import { TimeSync } from 'meteor/mizzao:timesync';

import { Button, Container, Col, Form, FormGroup, Input, ListGroup, ListGroupItem, Row } from 'reactstrap';

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
  listGoals() {
    return <ListGroup>
      {this.props.meet.goals.map((goal, idx) => {
        return <ListGroupItem key={idx}>{goal.statement}</ListGroupItem>
      })}
    </ListGroup>
  }
  render() {
    return (
      <Container>
        <Row noGutters={true}>
          <Col>
            <div className='center'>
              <h4>Copy/Share this link:</h4>
              <p>{window.location.href}</p>
              <h4>or this code:</h4>
              <p>{this.props.meet.meetId}</p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className='center'>
              <p className={`${this.state.timerClass}`}>Time Remaining:</p>
              <p>{this.state.currTime}</p>
            </div>
          </Col>
        </Row>

        <Row>
          <Col></Col>
          <Col>
            <h4>Goals:</h4>
            {this.listGoals()}
          </Col>
          <Col></Col>
        </Row>

        <Row>
          <Col></Col>
          <Col>
            <div className='center'>
              <Button className='importantButt bott' color="danger" onClick={this.endMeet.bind(this)}>End Early!</Button>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    );
  }
};

During.propTypes = {
  meet: PropTypes.objectOf({
    _id: PropTypes.string.isRequired,
    meetId: PropTypes.string.isRequired,
    duration: PropTypes.objectOf({
      hour: PropTypes.number.isRequired,
      min: PropTypes.number.isRequired,
    }).isRequired,
    goals: PropTypes.arrayOf(PropTypes.objectOf({
      statement: PropTypes.string.isRequired
    }).isRequired).isRequired,
    people: PropTypes.arrayOf(PropTypes.objectOf({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    }).isRequired).isRequired,
    createDate: PropTypes.number.isRequired,
    started: PropTypes.bool.isRequired,
    ended: PropTypes.bool.isRequired
  }).isRequired
};

