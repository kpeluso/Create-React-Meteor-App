import createHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import React from 'react';
import { Tracker } from 'meteor/tracker';

import { Meets } from '../api/meets';

import After from './After';
import During from './During';
import Loading from './Loading';

export default class Created extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: <Loading />,
      error: ''
    };
  }
  componentDidMount() {
    this.meetTracker = Tracker.autorun(() => {
      const subHandle = Meteor.subscribe('allMeets');
      const loading = !subHandle.ready();

      const maybeMeet = Meets.find({meetId: this.props.meetId}).fetch();
      if (!maybeMeet.length && loading) {
        this.setState({active: <Loading />});
      } else if (!loading) {
        if (maybeMeet.length) {
          let myMeet = maybeMeet[0];

          if (!myMeet.started) {
            Meteor.call(
              'meets.start',
              { meetId: myMeet.meetId },
              (err) => {
                if (!err) {
                  alert('Your meeting has started!');
                } else {
                  alert(err.reason);
                  this.setState({error: err.reason})
                }
              }
            );
          } else {
            this.handleDurAft(myMeet);
          }
        } else {
          createHistory().push('/PageNotFound');
          window.location.reload();
        }
      }
    });
  }
  componentWillUnmount() {
    this.meetTracker.stop();
  }
  handleDurAft(myMeet) {
    if (myMeet.started) {
      if (myMeet.ended) {
        this.setState({active: <After meet={myMeet} />});
      } else {
        this.setState({active: <During meet={myMeet} />});
      }
    }
  }
  render() {
    return (
      <div className='container'>
        {this.state.active}
      </div>
    );
  }
}

Created.propTypes = {
  meetid: PropTypes.string.isRequired
};

