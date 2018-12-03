import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import FileListView from './containers/FileListView';
import FileRegister from './components/FileRegister';
import FileRegisterManually from './components/FileRegisterManually';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

/* jshint ignore:start */
ReactDOM.render(
  <BrowserRouter>
    <Switch>
        <Route exact path="/" component={App} />
        <Route path="/file-list" component={FileListView} />
        <Route path="/file-register" component={FileRegister} />
        <Route path="/file-register-manually" component={FileRegisterManually} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);



/* jshint ignore:end */
registerServiceWorker();
