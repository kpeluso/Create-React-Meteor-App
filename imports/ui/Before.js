import createHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React from 'react';
import { Button, Container, Col, Form, FormGroup, Input, Row } from 'reactstrap';

export default class Before extends React.Component {
  // Source:
  // https://goshakkk.name/array-form-inputs/
  constructor() {
    super();
    this.state = {
      duration: {
        hour: 1,
        min: 0
      },
      goals: [{ statement: '' }],
      people: [{ name: '', email: '' }, { name: '', email: '' }],
      error: ''
    }
  }
  handleDurationChange = (unit) => (evt) => { // unit === 'hour' || unit === 'min'
    const newDuration = this.state.duration;
    newDuration[unit] = parseInt(evt.target.value);
    this.setState({ newDuration });
  }
  handleGoalChange = (idx) => (evt) => {
    const newGoals = this.state.goals.map((goal, sidx) => {
      if (idx !== sidx) return goal;
      return { ...goal, statement: evt.target.value };
    });
    this.setState({goals: newGoals});
  }
  handleNameChange = (idx) => (evt) => {
    const newNamed = this.state.people.map((person, sidx) => {
      if (idx !== sidx) return person;
      return { ...person, name: evt.target.value };
    });
    this.setState({ people: newNamed });
  }
  handleEmailChange = (idx) => (evt) => {
    const newEmails = this.state.people.map((person, sidx) => {
      if (idx !== sidx) return person;
      return { ...person, email: evt.target.value };
    });
    this.setState({ people: newEmails });
  }
  handleSubmit = (evt) => {
    evt.preventDefault();
    let valid = true;
    // clear unfilled goals
    const cleanMeet = {};
    cleanMeet.goals = this.state.goals.filter(goal => goal.statement.length);
    cleanMeet.people = this.state.people.filter(person => person.name.length);
    if (this.errCheck(cleanMeet)) {
      cleanMeet.duration = this.state.duration;
      this.insertMeet(cleanMeet);
    }
  }
  errCheck(cleanMeet) {
    // validate user input on client
    if (cleanMeet.goals.length < 1) {
      alert('A meeting must have at least 1 goal!');
      return false;
    }
    if (cleanMeet.people.length < 2) {
      alert('A meeting must have at least 2 participants!');
      return false;
    }
    return true;
  }
  insertMeet(cleanMeet) {
    // insert meet into collection
    Meteor.call(
      'meets.create',
      cleanMeet,
      (err, newId) => {
        if (!err) {
          createHistory().push('/meet?m='+newId);
          window.location.reload();
        } else {
          alert(err.reason);
          this.setState({error: err.reason})
        }
      }
    );
  }
  handleAdd = (gopers) => () => { // gopers === 'goals' || gopers === 'people'
    const addThis = gopers === 'goals' ? [{ statement: '' }] : [{ name: '', email: '' }];
    const newState = {};
    newState[gopers] = this.state[gopers].concat(addThis);
    this.setState(newState);
  }
  handleRemove = (gopers) => (idx) => () => {
    const newState = {};
    newState[gopers] = this.state[gopers].filter((s, sidx) => idx !== sidx);
    this.setState(newState);
  }
  render() {
    return (
      <Container>
        <Row>
          <Col></Col>
          <Col>
            <h3>Plan your meeting.</h3>
            <small>Tip: Only start a meeting with a problem in mind, and be sure to meet at the site of the problem.</small>
            <br/>
            <small>Tip: Invite less than 5 (relevant) participants and less than 5 goals.</small>
            <hr />
          </Col>
          <Col></Col>
        </Row>

        <Form method='post' onSubmit={this.handleSubmit}>

          <FormGroup row>
            <Col></Col>
            <Col>
              <Row>
                <Col>
                  Duration:
                </Col>
              </Row>
              <Row>
                <Col></Col>
                <Col>
                  <Input type='number' name='duration_hour' value={this.state.duration.hour} onChange={this.handleDurationChange('hour')} min='0' max='24' placeholder='0-24' />
                </Col>
                <Col>
                  hour(s)
                </Col>
              </Row>
              <Row>
                <Col></Col>
                <Col>
                  <Input type='number' name='duration_min' value={this.state.duration.min} onChange={this.handleDurationChange('min')} min='0' max='59' placeholder='0-59' />
                </Col>
                <Col>
                  minutes
                </Col>
              </Row>
              <hr />
            </Col>
            <Col></Col>
          </FormGroup>

          <Row>
            <Col></Col>
            <Col>
              <p>Goals:</p>
              {/* input name = goals */}
              {this.state.goals.map((goal, idx) => (
                <FormGroup row>
                  <Col className="goal" key={`goal_${idx + 1}`}>
                    <Input
                      type="text"
                      placeholder={`goal_${idx + 1}`}
                      value={goal.statement}
                      onChange={this.handleGoalChange(idx)}
                    />
                  </Col>
                  <Col xs='auto'>
                    <Button type="button" color="danger" onClick={this.handleRemove('goals')(idx)} className="small">X</Button>
                  </Col>
                </FormGroup>
              ))}
              <Row>
                <Col></Col>
                <Col>
                  <Button type="button" color="success" onClick={this.handleAdd('goals')} className="small">Add Goal</Button>
                </Col>
                <Col></Col>
              </Row>
              <hr />
            </Col>
            <Col></Col>
          </Row>

          <Row>
            <Col></Col>
            <Col>
              <p>People:</p>
              {/* input name = people */}
              {/* every person gets an email or null email too */}
              {this.state.people.map((person, idx) => (
                <FormGroup className="person" key={`name_${idx + 1}`} row>
                  <Col>
                    <Input
                      type="text"
                      placeholder={`Full Name`}
                      value={person.name}
                      onChange={this.handleNameChange(idx)}
                    />
                    <Input
                      type="email"
                      placeholder={`optional@email.com`}
                      value={person.email}
                      onChange={this.handleEmailChange(idx)}
                    />
                  </Col>
                  <Col xs='auto'>
                    <Button type="button" color="danger" onClick={this.handleRemove('people')(idx)} className="small">X</Button>
                  </Col>
                </FormGroup>
              ))}
              <Row>
                <Col></Col>
                <Col>
                  <Button type="button" color="success" onClick={this.handleAdd('people')} className="small">Add Participant</Button>
                </Col>
                <Col></Col>
              </Row>
              <hr />
            </Col>
            <Col></Col>
          </Row>

          <Row>
            <Col></Col>
            <Col>
              <Button className='importantButt bott' color="primary" type='submit'>Ready?</Button>
            </Col>
            <Col></Col>
          </Row>

        </Form>
      </Container>
    );
  }
};





