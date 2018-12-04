import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import FileList from '../components/FileList';
import './App.css'; //TODO: defien FileListView own CSS

class FileListView extends Component {
  constructor() {
    super();
  }
  render() {
    /*jshint ignore:start*/
    return (
        <Tabs defaultActiveKey="data" bsStyle="tabs" animation={false} id="filelist-tab" mountOnEnter={true} unmountOnExit={true}>
            <Tab eventKey="data" title="Data">
                <FileList pageSize={5} hideFields={['category']} category="data" />
            </Tab>
            <Tab eventKey="code" title="Code">
                <FileList pageSize={5} hideFields={['category']} category="code" />
            </Tab>
        </Tabs>
    );
    /*jshint ignore:end*/
  }
}

export default FileListView;
