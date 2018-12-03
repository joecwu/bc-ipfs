import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Grid, Row, Col } from 'react-bootstrap';

import FileList from '../components/FileList';
import FileRegister from '../components/FileRegister';
import FileRegisterManually from '../components/FileRegisterManually';
import FileAccessManually from '../components/FileAccessManually';

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
        <p className="App-intro">
          To get started, click on button <code>Browse</code> to upload files.
        </p>
        <p>
          When you have completed uploading files and entering descriptions, click on{' '}
          <code>Register on BlockChain</code> to claim your reward.
        </p>
        <Grid fluid>
          <Row className="show-grid">
            <Col>
              <FileRegister />
              <hr width="80%" />
              <FileRegisterManually />
            </Col>
            <Col>
              <p align="left">
                <b>Top Files</b>
              </p>
              <FileList pageSize={5} />
              <FileAccessManually />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
  /* jshint ignore:end */
}

export default App;
