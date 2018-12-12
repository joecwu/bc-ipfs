import React, { Component } from 'react';
import { Panel, Jumbotron, Button } from 'react-bootstrap';
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
        <Jumbotron style={{ padding: '30px' }}>
          <h2>Have large files to upload?</h2>
          <p>Download our desktop tool to help you upload large files.</p>
          <p>
            <Button bsStyle="primary" disabled={true}>MacOS</Button> <Button bsStyle="primary" disabled={true}>Window</Button>{' '}
            <Button bsStyle="primary" disabled={true}>Linux</Button>
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
