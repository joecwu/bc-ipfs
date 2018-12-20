import React, { Component } from 'react';
import { Panel, Jumbotron, Button, Alert } from 'react-bootstrap';
import FileRegister from '../components/FileRegister';
import BrowserAlert from '../components/BrowserAlert';
import GetEtherWalletPanel from '../components/panels/GetEtherWalletPanel';
import PurchaseEtherForBMDPanel from '../components/panels/PurchaseEtherForBMDPanel';
import isMobile from '../utils/lib_user_agent';
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
        <BrowserAlert />
        <GetEtherWalletPanel title="1. Get Ethereum Wallet" />
        <PurchaseEtherForBMDPanel title="2. Purchase Ethereum Tokens" />
        <Panel bsStyle="primary" defaultExpanded="true">
          <Panel.Heading>
            <Panel.Title toggle componentClass="h3">3. Registering Files</Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <FileRegister />
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
        <Panel bsStyle="primary" defaultExpanded={!isMobile.any()}>
          <Panel.Heading>
            <Panel.Title toggle componentClass="h3">4. Have Large Files to upload?</Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <p>Download our desktop tool to help you upload large files.</p>
              <p>
                <Button bsStyle="info" href={CONFIG.desktop_tool.mac}>MacOS</Button>{' '}
                <Button bsStyle="info" href={CONFIG.desktop_tool.windows}>Window</Button>{' '}
                <Button bsStyle="info" href={CONFIG.desktop_tool.rpm}>Linux(RPM)</Button>{' '}
                <Button bsStyle="info" href={CONFIG.desktop_tool.deb}>Linux(Deb)</Button>{' '}
              </p>
            </Panel.Body>
          </Panel.Collapse>
        </Panel>

      </div>
    );
    /*jshint ignore:end*/
  }
}

export default FileRegisterView;
