import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import FileAccessView from './containers/FileAccessView';
import FileRegisterView from './containers/FileRegisterView';
import FileRegisterManuallyView from './containers/FileRegisterManuallyView';
import FileRegisterBridgeView from './containers/FileRegisterBridgeView';
import FileAccessManuallyView from './containers/FileAccessManuallyView';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

/* jshint ignore:start */
ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/file-access" component={FileAccessView} />
      <Route path="/file-access-manually" component={FileAccessManuallyView} />
      <Route path="/file-register" component={FileRegisterView} />
      <Route path="/file-register-manually" component={FileRegisterManuallyView} />
      <Route path="/file-register-bridge" component={FileRegisterBridgeView} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root'),
);

/* jshint ignore:end */
registerServiceWorker();
