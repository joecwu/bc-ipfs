import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import FileAccessManually from '../components/FileAccessManually';
import './App.css'; //TODO: defien FileRegisterView own CSS

class FileAccessManuallyView extends Component {
  constructor() {
    super();
  }
  render() {
    /*jshint ignore:start*/
    return (
    <div className="App">
        <header className="App-header">
          <h1>IPFS Access</h1>
        </header>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Access File Manually</Panel.Title>
          </Panel.Heading>
          <Panel.Body><FileAccessManually /></Panel.Body>
        </Panel>
      </div>
    );
    /*jshint ignore:end*/
  }
}

export default FileAccessManuallyView;
