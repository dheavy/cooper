import React, {Component} from 'react';
import {Router, Route, Redirect} from 'react-router';
import PropTypes from 'baobab-react/prop-types';
import App from './App.jsx';
import history from '../utils/history';

export default class AppRouter extends Component {
  static contextTypes = {
    tree: PropTypes.baobab
  };

  render() {
    const isUserAuthenticated = () => {
      return this.context.tree.get('user', 'status', 'authenticated');
    };

    return (
      <Router history={history}>
        <Route path="/" component={App}>

        </Route>
      </Router>
    );
  }
}
