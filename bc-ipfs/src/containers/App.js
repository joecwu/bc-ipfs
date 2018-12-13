import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Grid, Row, Col, Panel } from 'react-bootstrap';

import FileList from '../components/FileList';
import FileRegister from '../components/FileRegister';
import FileRegisterManually from '../components/FileRegisterManually';
import FileAccessManually from '../components/FileAccessManually';
import EtherWalletAlert from '../components/EtherWalletAlert';

class App extends Component {
  constructor() {
    super();
  }

  /* jshint ignore:start */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>IPFS Register</h1>
        </header>
        <EtherWalletAlert />
        <p className="App-intro">
          To get started, click on button <code>Browse</code> to upload files.
        </p>
        <p className="App-context">
          When you have completed uploading files and entering descriptions, click on{' '}
          <code>Register on BlockChain</code> to claim your reward.
        </p>
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
        <Panel bsStyle="success">
          <Panel.Heading>
            <Panel.Title componentClass="h3">File Access by Search</Panel.Title>
          </Panel.Heading>
          <Panel.Body><FileList pageSize={5} /></Panel.Body>
        </Panel>
        <Panel bsStyle="info">
          <Panel.Heading>
            <Panel.Title componentClass="h3">File Access Manually</Panel.Title>
          </Panel.Heading>
          <Panel.Body><FileAccessManually /></Panel.Body>
        </Panel>
      </div>
    );
  }
  /* jshint ignore:end */
}

export default App;
