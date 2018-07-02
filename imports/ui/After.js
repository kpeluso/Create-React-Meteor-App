import createHistory from 'history/createBrowserHistory';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Button, Col, Form, FormGroup, Label, Input } from 'reactstrap';

export default class After extends React.Component {
  constructor(props) {
    super(props);
    const numGoals = this.props.meet.goals.length;
    const numPeople = this.props.meet.people.length;
    // const goal2People = Array.apply(false, Array(numPeople)).map(function () {});
    this.state = {
      goals2done: Array.apply(null, Array(numGoals)).map(function () {}),
      // goals2people: Array.apply(goal2People, Array(numGoals)).map(function () {})
      // goals2people: Array.apply(goal2People, Array(numGoals)).map(function () {})
      goals2people: [...Array(numGoals)].map(e => Array(numPeople))
    }
  }
  selectPeople(people, keyId) {
    return (
      <FormGroup key={`goal_${keyId+1}`} check row>
        <Label for={`${keyId}`} check>Select People</Label>
        <Col sm={{ size: 10, offset: 2 }}>
          {people.map((person, idx) => {
            return <p key={`person_${idx+1}`}><Input type='checkbox'  value={idx} />{person.name}</p>
          })}
        </Col>
      </FormGroup>
    );
  }
  handleGoals2DoneChange = (goalIdx) => (evt) => {
    const newGoals2Done = this.state.newGoals2Done.map((goal2Done, sidx) => {
      if (goalIdx !== sidx) return goal2Done;
      return evt.target.value;
    });
    this.setState({goals2done: newGoals2Done});
  }
  handleGoal2PeopleChange = (goalIdx, personIdx) => (evt) => {
    const newGoals2People = this.state.newGoals2People.map((goal2People, sidx) => {
      if (goalIdx !== sidx) return goal2People;
      return goal2People.map((personIdx, ssidx) => {
        if (personIdx !== ssidx) return goal2People;
        return evt.target.value;
      });
    });
    this.setState({goals2people: newGoals2People});
  }
  listParts() {
    return this.props.meet.people.map((person) => {
      return '%0D%0A'+person.name;
    });
  }
  listAccs() {
    return '%0D%0A'+this.state.goals2done.map((goalDone, idx) => {
      return !!goalDone+' - '+this.props.meet.goals[idx];
    });
  }
  listResps() {
    return this.state.goals2people.map((goal2people, goalIdx) => {
      return '%0D%0A'+this.props.meet.goals[goalIdx]+' - '+goal2people.map((persResp, persIdx) => {
        return !!persResp ? this.props.meet.people[persIdx].name+', ' : '';
      });
    });
  }
  emailText() {
    let parts = this.listParts();
    let accs = this.listAccs();
    let resps = this.listResps();
    let output = `Congrats! You made it through another meeting!
    %0D%0A
    %0D%0A Meeting ID: ${this.props.meet.meetId}
    %0D%0A
    %0D%0A Created at: ${moment(this.props.meet.createDate).format('MMM DD h:mm A')}
    %0D%0A
    %0D%0A This is who participated in the meeting:
    ${parts}
    %0D%0A
    %0D%0ADuring this meeting, we did/did not accomplished these goals:
    ${accs}
    %0D%0A
    %0D%0AResponsibilities:
    ${resps}
    %0D%0A
    %0D%0AThanks for using Meetr
    %0D%0ACreate a new meeting at: https://mmua.herokuapp.com`;
    return output;
  }
  handleSubmit(evt) {
    evt.preventDefault();
    const text = this.emailText();
    const createdAt = moment(this.props.meet.createDate).format('MMM DD h:mm A');
    const subject = "Meetr Receipt: Meeting "+this.props.meet.meetId+" created "+createdAt
    Meteor.call(
      'meets.rm',
      { meetId: this.props.meet.meetId },
      (err) => {
        if (!err) {
          //
          // semicolon delimited multiple emamil addresses
          //
          window.open(`mailto:test@example.com?subject=${subject}&body=${text}`);
          alert('Your meeting has been cleared from our records!');
          createHistory().push('/');
          window.location.reload();
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
        <Form method='post' onSubmit={this.handleSubmit.bind(this)}>
          <div className='box'>
            <h2>We made it!</h2>
            <h2>Congrats on finishing!</h2>
          </div>

          <div className='box'>
            <h2>Did we accomplish our goals?</h2>
            <small>Check the box for 'Yes', leave blank for 'No'.</small>
            {this.props.meet.goals.map((goal, idx) => {
              if (!!goal.statement) {
                return <p key={idx}>{idx+1}. <input type='checkbox' name={`goalDone_${idx+1}`} />{goal.statement}</p>;
              }
            })}
          </div>

          <div className='box'>
            <h2>Who is responsible for implementing finished goals or completing unmet goals?</h2>
            <small>Check the box for 'Yes', leave blank for 'No'.</small>
            {this.props.meet.goals.map((goal, idx) => {
              return <div key={idx}>{idx+1}. {goal.statement} {this.selectPeople(this.props.meet.people, idx)}</div>;
            })}
          </div>

          <div className='box'>
            <small>Make sure your pop-up blocker is disabled!</small>
            <p>Destroy meeting from collection upon button hit or after a fixed period of time (24 hours).</p>
            <Button type='submit'>Leave Meeting</Button>
          </div>
        </Form>
      </div>
    );
  }
};

