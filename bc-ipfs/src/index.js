import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

/* jshint ignore:start */
ReactDOM.render(<App />, document.getElementById('root'));
/* jshint ignore:end */

registerServiceWorker();
