import React from 'react';
import {render} from 'react-dom';
import {root} from 'baobab-react/higher-order';
import states from './states';
import AppRouter from './components/AppRouter.jsx';

require('!style!css!purecss/build/pure-min.css');

const MyPleasure = root(AppRouter, states);
render(<MyPleasure />, document.getElementById('mount'));

export default states;
