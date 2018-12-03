import React, { Component } from 'react';
import { Button, Form, Grid, Row, Col, Table } from 'react-bootstrap';
import FileList from '../components/FileList';
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
          <h1>Top Files</h1>
        </header>
        <FileList pageSize={5} />
      </div>
    );
    /*jshint ignore:end*/
  }
}

export default FileListView;
