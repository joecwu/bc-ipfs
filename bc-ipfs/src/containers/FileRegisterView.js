import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import FileRegister from '../components/FileRegister';
import FileRegisterManually from '../components/FileRegisterManually';
import './App.css'; //TODO: defien FileRegisterView own CSS

class FileRegisterView extends Component {
  constructor() {
    super();
  }
  render() {
    /*jshint ignore:start*/
    return (
    <div className="App">
        <header className="App-header">
          <h1>IPFS Register</h1>
        </header>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Registering Files</Panel.Title>
          </Panel.Heading>
          <Panel.Body><FileRegister /></Panel.Body>
        </Panel>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Registering File Manually</Panel.Title>
          </Panel.Heading>
          <Panel.Body><FileRegisterManually /></Panel.Body>
        </Panel>
      </div>
    );
    /*jshint ignore:end*/
  }
}

export default FileRegisterView;
