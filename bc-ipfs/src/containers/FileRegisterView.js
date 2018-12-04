import React, { Component } from 'react';
import { Button, Form, Grid, Row, Col, Table } from 'react-bootstrap';
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
        <p className="App-intro">
          To get started, click on button <code>Browse</code> to upload files.
        </p>
        <p>
          When you have completed uploading files and entering descriptions, click on{' '}
          <code>Register on BlockChain</code> to claim your reward.
        </p>
        <FileRegister />
        <hr width="80%" />
        <FileRegisterManually />
      </div>
    );
    /*jshint ignore:end*/
  }
}

export default FileRegisterView;
