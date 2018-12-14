import React, { Component } from 'react';
import { Panel, Jumbotron, Button, Alert } from 'react-bootstrap';
import FileRegister from '../components/FileRegister';
import EtherWalletAlert from '../components/EtherWalletAlert';
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
        <EtherWalletAlert />
        <Jumbotron className='desktop-only' style={{ padding: '30px' }}>
          <h2>Have large files to upload?</h2>
          <p>Download our desktop tool to help you upload large files.</p>
          <p>
            <Button bsStyle="primary" href='https://download.blcksync.info/app/Orion-BlockMed/0.9.1/Orion-BlockMed-0.9.1-mac.zip'>MacOS</Button>{' '}
            <Button bsStyle="primary" href='https://download.blcksync.info/app/Orion-BlockMed/0.9.1/Orion-BlockMed%20Setup%200.9.1.exe'>Window</Button>{' '}
            <Button bsStyle="primary" href='https://download.blcksync.info/app/Orion-BlockMed/0.9.1/Orion-BlockMed-0.9.1.x86_64.rpm'>Linux(RPM)</Button>{' '}
            <Button bsStyle="primary" href='https://download.blcksync.info/app/Orion-BlockMed/0.9.1/Orion-BlockMed_0.9.1_amd64.deb'>Linux(Deb)</Button>{' '}
          </p>
        </Jumbotron>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Registering Files</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <FileRegister />
          </Panel.Body>
        </Panel>
      </div>
    );
    /*jshint ignore:end*/
  }
}

export default FileRegisterView;
