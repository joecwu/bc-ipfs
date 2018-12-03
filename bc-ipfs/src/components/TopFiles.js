import React, { Component } from 'react';
import { Button, Form, Grid, Row, Col, Table } from 'react-bootstrap';
import FileList from './FileList';

class TopFiles extends Component {
  constructor() {
    super();
  }
  render() {
    /*jshint ignore:start*/
    return (
      <div>
        <FileList pageSize={5} />
      </div>
    );
    /*jshint ignore:end*/
  }
}

export default TopFiles;
