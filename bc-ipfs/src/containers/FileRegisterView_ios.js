import React, { Component } from 'react';
import { Panel, Jumbotron, Button, Alert } from 'react-bootstrap';
import FileRegister from '../components/FileRegister_ios';
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
            <Button bsStyle="primary" href={CONFIG.desktop_tool.mac}>MacOS</Button>{' '}
            <Button bsStyle="primary" href={CONFIG.desktop_tool.windows}>Window</Button>{' '}
            <Button bsStyle="primary" href={CONFIG.desktop_tool.rpm}>Linux(RPM)</Button>{' '}
            <Button bsStyle="primary" href={CONFIG.desktop_tool.deb}>Linux(Deb)</Button>{' '}
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
