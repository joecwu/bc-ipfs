import React, { Component } from 'react';
import { Button, Form, Grid, Row, Col, Table } from 'react-bootstrap';
import TopFiles from '../components/TopFiles';

class FileListView extends Component {
  constructor() {
    super();
  }
  render() {
    /*jshint ignore:start*/
    return (
      <div>
        <h2>Top Files</h2>
        <TopFiles />
      </div>
    );
    /*jshint ignore:end*/
  }
}

export default FileListView;
