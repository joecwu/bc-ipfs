import React, { Component } from 'react';
import { Button, Form, Grid, Row, Col, Table } from 'react-bootstrap';
import FileList from './FileList';

class TopFiles extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <FileList pageSize={5} />
      </div>
    );
  }
}

export default TopFiles;