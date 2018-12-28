import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import FileRegisterBridge from '../components/FileRegisterBridge';
import EtherWalletAlert from '../components/EtherWalletAlert';
import BrowserAlert from '../components/BrowserAlert';
import './App.css'; //TODO: defien FileRegisterView own CSS
import { hotjar } from 'react-hotjar';
import { HOTJAR_ID, HOTJAR_VERSION } from '../utils/lib_hotjar';

hotjar.initialize(HOTJAR_ID, HOTJAR_VERSION);

class FileRegisterBridgeView extends Component {
  constructor() {
    super();
  }
  componentDidMount() {
    // How do we get the values for filter and origin?
    console.debug(this.props);
  }
  render() {
    const params = qs.parse(this.props.location.search);
    /*jshint ignore:start*/
    return (
      <div className="App">
        <header className="App-header">
          <h1>IPFS Register</h1>
        </header>
        <BrowserAlert />
        <EtherWalletAlert />
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Registering File</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <FileRegisterBridge
              fileSize={Number(params.fileSize)}
              hashId={params.hashId}
              category={params.category}
              description={params.description}
            />
          </Panel.Body>
        </Panel>
      </div>
    );
    /*jshint ignore:end*/
  }
}

export default withRouter(FileRegisterBridgeView);
