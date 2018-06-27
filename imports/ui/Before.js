import createHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import React from 'react';
import { Redirect } from 'react-router';

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
    // this.setState({ goals: ...newGoals.goals });
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
    event.preventDefault();

    Meteor.call(
      'meets.create', {
        duration: {
          hour: this.state.duration.hour,
          min: this.state.duration.min
        },
        goals: this.state.goals.map((goal) => goal.statement),
        people: this.state.people.map((person) => person.name),
        emails: this.state.people.map((person) => person.email)
      },
      (err, newId) => {
        if (!err) {
          alert('Your meeting has been created!\nYour meeting will now begin...');
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
      <div className='box'>
        <h3>Plan your meeting.</h3>
        <small>Tip: Only start a meeting with a problem in mind, and be sure to meet at the site of the problem.</small>
        <small>Tip: Invite less than 5 (relevant) participants and less than 5 goals.</small>
        <form method='post' onSubmit={this.handleSubmit}>
          Duration: <input type='number' name='duration_hour' value={this.state.duration.hour} onChange={this.handleDurationChange('hour')} min='0' max='24' placeholder='0-24' /> hour(s), <input type='number' name='duration_min' value={this.state.duration.min} onChange={this.handleDurationChange('min')} min='0' max='59' placeholder='0-59' /> minutes


          <p>Goals:</p>
          {/* input name = goals */}
          {this.state.goals.map((goal, idx) => (
            <div className="goal" key={`goal_${idx + 1}`}>
              <input
                type="text"
                placeholder={`goal_${idx + 1}`}
                value={goal.statement}
                onChange={this.handleGoalChange(idx)}
              />
              <button type="button" onClick={this.handleRemove('goals')(idx)} className="small">X</button>
            </div>
          ))}
          <button type="button" onClick={this.handleAdd('goals')} className="small">Add Goal</button>


          <p>People:</p>
          {/* input name = people */}
          {/* every person gets an email or null email too */}
          {this.state.people.map((person, idx) => (
            <div className="person" key={`name_${idx + 1}`}>
              <input
                type="text"
                placeholder={`name_${idx + 1}`}
                value={person.name}
                onChange={this.handleNameChange(idx)}
              />
              <input
                type="text"
                placeholder={`email_${idx + 1}`}
                value={person.email}
                onChange={this.handleEmailChange(idx)}
              />
              <button type="button" onClick={this.handleRemove('people')(idx)} className="small">X</button>
            </div>
          ))}
          <button type="button" onClick={this.handleAdd('people')} className="small">Add Participant</button>


          <button type='submit'>Ready?</button>
        </form>
      </div>
    );
  }
};

