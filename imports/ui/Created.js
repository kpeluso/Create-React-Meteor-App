import createHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
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
      active: <Loading />
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
          this.setState({active: <During meet={maybeMeet[0]} />});
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
  render() {
    return (
      <div className='container'>
        {this.state.active}
      </div>
    );
  }
}

