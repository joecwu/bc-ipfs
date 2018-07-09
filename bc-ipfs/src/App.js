/*jshint esversion: 6*/
import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Button, Form, Grid } from 'react-bootstrap';

import lib_ipfs from './lib_ipfs';
import lib_web3 from './lib_web3';

class App extends Component {
  constructor () {
    super();
    // define our states to keep track
    this.state = {
      ipfshash: null
    };

    // The order/index in these queue matters
    this.idx_queue = []; // keep track of duplicates
    this.file_queue = [];
    this.ipfshash_queue = [];

    this.captureFile = this.captureFile.bind(this);
    this.saveToIpfs = this.saveToIpfs.bind(this);
    this.registerToBC = this.registerToBC.bind(this);
  }

  saveToIpfs (reader, idx) {
    let ipfsId;
    let fsize;
    const tmp_iqueue = this.ipfshash_queue;
    const dqueue = this.idx_queue;
    const buffer = Buffer.from(reader.result);

    lib_ipfs.add(buffer, { progress: (prog) => console.log(`IPFS uploaded bytes: ${prog}`) })
      .then((response) => {
        console.log(response);
        ipfsId = response[0].hash;
        fsize = response[0].size;
        console.log('ipfs hash=' + ipfsId);
        console.log('ipfs fsize=' + fsize);
        tmp_iqueue[idx] = ipfsId;
        dqueue.push(reader.name);
      }).catch((err) => {
        console.error(err);
        dqueue[idx] = nil;
      });
  }

  captureFile (event) {
    event.stopPropagation();
    event.preventDefault();
    const dqueue = this.idx_queue;
    const tmp_fqueue = this.file_queue;
    const tmp_iqueue = this.ipfshash_queue;
    const func_ptn = this.saveToIpfs;
    for(let i = 0; i < event.target.files.length; i++) {
      // TODO: track abs-path instaed of fname, duplicate can happen under diff dir
      if(dqueue.includes(event.target.files[i].name, 0)) {
        console.log('Skipping file ' + event.target.files[i].name + ' since it has been uploaded already');
      }
      else {
        let f = event.target.files[i];
        tmp_fqueue.push(f);
        let idx = tmp_fqueue.indexOf(f, 0);
        console.log('Queuing file ' + f.name + ' at index=' + idx);
        // register index for each file and upload order properly
        // TODO: will take up lots of memory for multiple files since we pre-load them all into memory
        let reader = new window.FileReader();
        tmp_iqueue[idx] = ''; // placeholder to avoid race condition
        console.log('Loading file ' + f.name + ' idx=' + idx);
        reader.onload = () => func_ptn(reader, idx);
        reader.readAsArrayBuffer(f); // load file into browser's memory as blob
      }
    }
  }

  /* jshint ignore:start */
  registerToBC (event) {
    event.preventDefault();
    const tmp_fqueue = this.file_queue;
    const tmp_iqueue = this.ipfshash_queue;
    try {
      lib_web3.eth.getAccounts( function(err, accounts) { 
        console.log(accounts);
        console.log('Applying eth account: ' + accounts[0]);
      });
    }
    catch(error) {
      console.log(error);
    }
    for(let i = 0; i < tmp_fqueue.length; i++) {
      console.log('Submitted file=' + tmp_fqueue[i].name);
      console.log('IPFS recprd=https://ipfs.io/ipfs/' + tmp_iqueue[i]);
    }
  }
  /* jshint ignore:end */

  /* jshint ignore:start */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>IPFS Registration</h1>
        </header>
        <p className="App-intro">
          To get started, click on button <code>submit</code> to upload files.
        </p>
        <Grid>
          <Form onSubmit={this.registerToBC}>
            <input 
              type = "file"
              multiple
              onChange = {this.captureFile}
            />
            <Button 
                bsStyle="primary" 
                type="submit"> 
                Register on BlockChain 
            </Button>
          </Form>
        </Grid>
      </div>
    );
  };
  /* jshint ignore:end */
}

export default App;