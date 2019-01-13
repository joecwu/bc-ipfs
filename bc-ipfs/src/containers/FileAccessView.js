import React, { Component } from 'react';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import FileList from '../components/FileList';
import BrowserAlert from '../components/BrowserAlert';
import GetEtherWalletPanel from '../components/panels/GetEtherWalletPanel';
import PurchaseEtherPanel from '../components/panels/PurchaseEtherPanel';
import ExchangeBMDTokensPanel from '../components/panels/ExchangeBMDTokensPanel';
import './App.css'; //TODO: defien FileAccessView own CSS

class FileAccessView extends Component {
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
        <BrowserAlert />
        <GetEtherWalletPanel title="1. Get Ethereum Wallet" />
        <PurchaseEtherPanel title="2. Fund Your Wallet with Ethereum" />
        <ExchangeBMDTokensPanel title="3. Exchange BlockMed(BMD) Tokens" />
        <Panel bsStyle="primary" defaultExpanded={true}>
          <Panel.Heading>
            <Panel.Title toggle componentClass="h3">
              4. File Access by Search
            </Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <Tabs
                defaultActiveKey="data"
                bsStyle="tabs"
                animation={true}
                id="filelist-tab"
                mountOnEnter={true}
                unmountOnExit={true}
              >
                <Tab eventKey="data" title="Data">
                  <FileList
                    pageSize={30}
                    hideFields={['category', 'latestPurchaseTime', 'encryptionVersion']}
                    category="data"
                  />
                </Tab>
                <Tab eventKey="code" title="Code">
                  <FileList
                    pageSize={30}
                    hideFields={['category', 'latestPurchaseTime', 'encryptionVersion']}
                    category="code"
                  />
                </Tab>
              </Tabs>
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      </div>
    );
    /*jshint ignore:end*/
  }
}

export default FileAccessView;
