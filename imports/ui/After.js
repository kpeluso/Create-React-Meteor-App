import createHistory from 'history/createBrowserHistory';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Col, Container, Form, FormGroup, Label, ListGroup, ListGroupItem, Input, Row } from 'reactstrap';

export default class After extends React.Component {
  constructor(props) {
    super(props);
    const numGoals = this.props.meet.goals.length;
    const numPeople = this.props.meet.people.length;
    this.state = {
      goals2done: Array.apply(false, Array(numGoals)).map(function () {}),
      goals2people: [...Array(numGoals)].map(e => Array.apply(false, Array(numPeople)).map(function () {}))
    }
  }
  selectPeople(people, keyId) {
    return (
      <FormGroup key={`goal_${keyId+1}`} check row>
        <Col sm={{ size: 10, offset: 2 }}>
          {people.map((person, idx) => {
            return <p key={`person_${idx+1}`}><Label check><Input type='checkbox'  value={idx} onChange={this.handleGoal2PeopleChange(keyId, idx)} value={true} />{person.name}</Label></p>
          })}
        </Col>
      </FormGroup>
    );
  }
  handleGoals2DoneChange = (goalIdx) => (evt) => {
    const newGoals2Done = this.state.goals2done.map((goal2Done, sidx) => {
      if (goalIdx !== sidx) return goal2Done;
      return !goal2Done;
    });
    this.setState({goals2done: newGoals2Done});
  }
  handleGoal2PeopleChange = (goalIdx, personIdx) => (evt) => {
    const newGoals2People = this.state.goals2people.map((goal2People, sidx) => {
      if (goalIdx !== sidx) return goal2People;
      return goal2People.map((personResponsible, ssidx) => {
        if (personIdx !== ssidx) return personResponsible;
        return !personResponsible;
      });
    });
    this.setState({goals2people: newGoals2People});
  }
  bool2emoji(b) {
    if (b) { return '\u2705'; }
    return '\u274C'
  }
  listParts() {
    return '%0D%0A %09 \u270B%20-%20'+this.props.meet.people.map((person) => {
      return person.name;
    }).join('%0D%0A %09 \u270B%20-%20');
  }
  listAccs() {
    return '%0D%0A %09'+this.state.goals2done.map((goalDone, idx) => {
      return this.bool2emoji(goalDone)+'%20-%20'+this.props.meet.goals[idx].statement;
    }).join('%0D%0A %09');
  }
  listResps() {
    return this.state.goals2people.map((goal2people, goalIdx) => {
      return '%0D%0A %09 \u270F%20-%20'+this.props.meet.goals[goalIdx].statement+'%20-%20'+goal2people.map((persResp, persIdx) => {
        return persResp ? this.props.meet.people[persIdx].name : '';
      }).join(',%20');
    });
  }
  emailText() {
    let parts = this.listParts();
    let accs = this.listAccs();
    let resps = this.listResps();
    let repeatSparks = '\u2728'.repeat(19);
    let output = `${repeatSparks}
    %0D%0A \u2728 Congrats! You made it through another meeting! %20 \u2728
    %0D%0A ${repeatSparks}
    %0D%0A
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
    %0D%0A
    %0D%0AThanks for using Meetr \u2764 \u2764
    %0D%0ACreate a new meeting at %20\u27A1%20 https://mmua.herokuapp.com
    %0D%0A \u2757 Let's Make Meetings Useful Again! \u2757
    %0D%0A
    %0D%0A \u270C %20 \u270C
    %0D%0A`;
    return output;
  }
  handleSubmit(evt) {
    evt.preventDefault();
    const text = this.emailText();
    const emails = this.props.meet.people.map(person => person.email).join(';%20');
    const createdAt = moment(this.props.meet.createDate).format('MMM DD h:mm A');
    const subject = "Meetr Receipt from " + createdAt;
    Meteor.call(
      'meets.rm',
      { meetId: this.props.meet.meetId },
      (err) => {
        if (!err) {
          window.open(`mailto:${emails}?subject=${subject}&body=${text}`);
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
      <Form method='post' onSubmit={this.handleSubmit.bind(this)}>
        <Container>
          <Row noGutters={true}>
            <Col></Col>
            <Col>
              <div className='center'>
                <h4>We made it!</h4>
                <h4>Congrats on finishing!</h4>
                <hr />
              </div>
            </Col>
            <Col></Col>
          </Row>

          <Row noGutters={true}>
            <Col></Col>
            <Col>
              <h4 className='addTop'>Did we accomplish our goals?</h4>
              <small>Check for 'Yes', leave blank for 'No'.</small>
              <ListGroup>
                {this.props.meet.goals.map((goal, idx) => {
                  if (!!goal.statement) {
                    return <div key={idx}>
                      <ListGroupItem tag='a' name={`goalDone_${idx+1}`} onClick={this.handleGoals2DoneChange(idx)} action>
                        <div className='leftMarg'>
                            <Input type='checkbox' checked={this.state.goals2done[idx]} name={`goalDone_${idx+1}`} onChange={this.handleGoals2DoneChange(idx)} value={true} />{' '}
                            {idx+1}{'. '}
                            {goal.statement}
                        </div>
                        </ListGroupItem>
                    </div>
                  }
                })}
              </ListGroup>
              <hr />
            </Col>
            <Col></Col>
          </Row>

          <Row noGutters={true}>
            <Col></Col>
            <Col>
              <h4 className='addTop'>Who is responsible for implementing finished goals or completing unmet goals?</h4>
              <small>Check to indicate 'This person is responsible'.</small>
              <ListGroup>
                {this.props.meet.goals.map((goal, idx) => {
                  return <ListGroupItem key={idx}><p>{idx+1}. {goal.statement}</p> {this.selectPeople(this.props.meet.people, idx)}</ListGroupItem>;
                })}
              </ListGroup>
              <hr className='addTop' />
            </Col>
            <Col></Col>
          </Row>

          <Row>
            <Col></Col>
            <Col>
              <Row>
                <Col>
                  <small>Make sure your pop-up blocker is disabled!</small>
                </Col>
              </Row>
              <Row>
                <Col>
                  <small>(Meetr wants to automatically generate an email receipt)</small>
                </Col>
              </Row>
              <Button color='primary' className='importantButt bott addTop' type='submit'>Leave Meeting</Button>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </Form>
    );
  }
};

After.propTypes = {
  meet: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    meetId: PropTypes.string.isRequired,
    duration: PropTypes.shape({
      hour: PropTypes.number.isRequired,
      min: PropTypes.number.isRequired,
    }).isRequired,
    goals: PropTypes.arrayOf(PropTypes.shape({
      statement: PropTypes.string.isRequired
    }).isRequired).isRequired,
    people: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    }).isRequired).isRequired,
    createDate: PropTypes.number.isRequired,
    started: PropTypes.bool.isRequired,
    ended: PropTypes.bool.isRequired
  }).isRequired
};

