import React, { Component } from 'react';
import { Panel, Jumbotron, Button, Alert } from 'react-bootstrap';
import FileRegister from '../components/FileRegister';
import BrowserAlert from '../components/BrowserAlert';
import GetEtherWalletPanel from '../components/panels/GetEtherWalletPanel';
import PurchaseEtherPanel from '../components/panels/PurchaseEtherPanel';
import ExchangeBMDTokensPanel from '../components/panels/ExchangeBMDTokensPanel';
import isMobile from '../utils/lib_user_agent';
import './App.css'; //TODO: defien FileRegisterView own CSS
import { HOTJAR_ID, HOTJAR_VERSION } from './utils/lib_hotjar';

hotjar.initialize(HOTJAR_ID, HOTJAR_VERSION);

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
        <PurchaseEtherPanel title="2. Fund Your Wallet with Ethereum" />
        <Panel bsStyle="primary" defaultExpanded={true}>
          <Panel.Heading>
            <Panel.Title toggle componentClass="h3">
              3. Registering Files
            </Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <FileRegister />
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
        <Panel bsStyle="primary" defaultExpanded={!isMobile.any()}>
          <Panel.Heading>
            <Panel.Title toggle componentClass="h3">
              4. Have Large Files to upload?
            </Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <Alert bsStyle="warning" style={{ display: isMobile.any() ? 'block' : 'none' }}>
                <strong>Please use desktop to download the tools. </strong>
              </Alert>
              <p>Download our desktop tool to help you upload large files.</p>
              <p>
                <Button bsStyle="info" href={CONFIG.desktop_tool.mac} disabled={isMobile.any()}>
                  MacOS
                </Button>{' '}
                <Button bsStyle="info" href={CONFIG.desktop_tool.windows} disabled={isMobile.any()}>
                  Window
                </Button>{' '}
                <Button bsStyle="info" href={CONFIG.desktop_tool.rpm} disabled={isMobile.any()}>
                  Linux(RPM)
                </Button>{' '}
                <Button bsStyle="info" href={CONFIG.desktop_tool.deb} disabled={isMobile.any()}>
                  Linux(Deb)
                </Button>{' '}
              </p>
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
        <ExchangeBMDTokensPanel title="5. Exchange BlockMed(BMD) Tokens" />
      </div>
    );
    /*jshint ignore:end*/
  }
}

export default FileRegisterView;
