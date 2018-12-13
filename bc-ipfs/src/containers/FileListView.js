import React, { Component } from 'react';
import { Tabs, Tab, Panel } from 'react-bootstrap';
import FileList from '../components/FileList';
import EtherWalletAlert from '../components/EtherWalletAlert';
import './App.css'; //TODO: defien FileListView own CSS

class FileListView extends Component {
  constructor() {
    super();
  }
  render() {
    /*jshint ignore:start*/
    return (
      <div className="App">
        <header className="App-header">
            <h1>IPFS File List</h1>
        </header>
        <EtherWalletAlert />
        <Panel bsStyle="success">
          <Panel.Heading>
            <Panel.Title componentClass="h3">File Access by Search</Panel.Title>
          </Panel.Heading>
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
                <FileList pageSize={5} hideFields={['category']} category="data" />
              </Tab>
              <Tab eventKey="code" title="Code">
                <FileList pageSize={5} hideFields={['category']} category="code" />
              </Tab>
            </Tabs>
          </Panel.Body>
        </Panel>
      </div>
    );
    /*jshint ignore:end*/
  }
}

export default FileListView;
