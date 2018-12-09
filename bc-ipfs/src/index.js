import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import FileListView from './containers/FileListView';
import FileRegisterView from './containers/FileRegisterView';
import FileRegisterManuallyView from './containers/FileRegisterManuallyView';
import FileAccessManuallyView from './containers/FileAccessManuallyView';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

/* jshint ignore:start */
ReactDOM.render(
  <BrowserRouter>
    <Switch>
        <Route exact path="/" component={App} />
        <Route path="/file-list" component={FileListView} />
        <Route path="/file-register" component={FileRegisterView} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);



/* jshint ignore:end */
registerServiceWorker();
