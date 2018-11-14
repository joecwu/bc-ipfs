import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  /* jshint ignore:start */
  ReactDOM.render(<App />, div);
  /* jshint ignore:end */
  ReactDOM.unmountComponentAtNode(div);
});
