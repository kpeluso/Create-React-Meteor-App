import createHistory from 'history/createBrowserHistory';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import queryString from 'query-string';
import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router';

// import { Session } from 'meteor/session';

import { Meets } from '../api/meets';

import Header from '../ui/Header';
import Landing from '../ui/Landing';
import Before from '../ui/Before';
import Created from '../ui/Created';
import NotFound from '../ui/NotFound';

const browserHistory = createHistory();

export const routes = (
  <div id='app'>
    <Header />
    <Router history={browserHistory}>
      <Switch>
        <Route exact path="/" render={() => {
          return <Landing />
        }} />
        <Route path="/before" render={() => {
          return <Before />
        }} />
        <Route path="/meet" render={() => {
          Meteor.subscribe('allMeets');

          const maybeId = queryString.parse(location.search).m;

          console.log(typeof maybeId);
          console.log(maybeId);

          const maybeMeet = Meets.find({meetId: maybeId}).fetch();

          return maybeMeet.length ? <Created meet={maybeMeet[0]} /> : <NotFound />;
        }} />
        <Route path="*" render={() => {
          return <NotFound />
        }} />
      </Switch>
    </Router>
  </div>
);

