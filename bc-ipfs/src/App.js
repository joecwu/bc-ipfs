/*jshint esversion: 6*/
import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import { Button, Form, Grid, Row, Col } from 'react-bootstrap';

import lib_ipfs from './lib_ipfs';
import lib_web3 from './lib_web3';
import lib_contract from './lib_contract';
import bcutils from './lib_bcutils';
import sha256coder from './lib_hash';
import crypto_js from './lib_crypto';

class App extends Component {
  constructor () {
    super();
    // define our states to keep track
    this.state = {
      ipfs_metadata: '',
      ipfs_metahash: '',
      ipfs_realhash: '',
      ipfs_filesize: '',
      access_ipfs_metadata: '',
      access_encrypted_idx: '',
      bc_resp_hash: '*******'
    };

    // The order/index in these queue matters
    this.idx_queue = []; // keep track of duplicates
    this.file_queue = [];
    this.ipfshash_queue = [];
    // keep track of duplicate registration, if the user refresh the browser,
    // everything will be reset as well
    this.bc_register = []; // per entry is {"ipfsMetaData":"", "encryptedIdx":""}

    this.captureFileAndMetadata = this.captureFileAndMetadata.bind(this);
    this.captureAccessInfo = this.captureAccessInfo.bind(this);
    this.saveToIpfs = this.saveToIpfs.bind(this);
    this.registerToBC = this.registerToBC.bind(this);
    this.accessBC = this.accessBC.bind(this);
  }

  saveToIpfs (reader, idx) {
    let ipfsId;
    let fsize;
    const tmp_iqueue = this.ipfshash_queue;
    const dqueue = this.idx_queue;
    const buffer = Buffer.from(reader.result);

    lib_ipfs.add(buffer, { progress: (prog) => console.log('IPFS uploaded bytes:' + prog) })
      .then((response) => {
        console.log(response);
        ipfsId = response[0].hash;
        fsize = response[0].size;
        console.log('ipfs hash=' + ipfsId);
        console.log('ipfs fsize=' + fsize);
        tmp_iqueue[idx] = response[0];
        dqueue.push(reader.name);
      }).catch((err) => {
        console.error(err);
        dqueue[idx] = nil;
      });
  }

  captureFileAndMetadata (event) {
    event.stopPropagation();
    event.preventDefault();
    const dqueue = this.idx_queue;
    const tmp_fqueue = this.file_queue;
    const tmp_iqueue = this.ipfshash_queue;
    const func_ptn = this.saveToIpfs;

    const target = event.target;
    const type = target.type;
    const name = target.name;

    if(type === 'text') {
      console.log('Capturing input from ' + name + ' with value = ' + target.value);
      this.setState({
        [name]: target.value
      });
      return;
    } else if(type === 'file') {
      console.log('Detectuser is trying to select files to upload!');
    } else {
      console.log('Detect unknown type=' + type + ' with name=' + name);
      return;
    }

    if(event.target.files) {
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
    else {
      console.log('No file has been uploaded yet!');
    }
  }

  /* jshint ignore:start */
  registerToBC (event) {
    let ipfsmeta = this.state.ipfs_metadata;
    let ipfs_single_realhash = this.state.ipfs_realhash;
    let ipfs_single_fsize = this.state.ipfs_filesize;
    let ipfs_single_mhash = this.state.ipfs_metahash;
    console.log('Submitting with metadata = ' + ipfsmeta);
    event.preventDefault();
    const tmp_fqueue = this.file_queue;
    const tmp_iqueue = this.ipfshash_queue;
    const bc_queue = this.bc_register;

    const contract_address= lib_contract.options.address;
    console.log('Identified contract address = ' + contract_address);
    let submit_acct = '';

    try {
      lib_web3.eth.getAccounts( function(err, accounts) { 
        console.log("All available accounts: " + accounts);
        submit_acct = accounts[0];
        console.log('Applying the first eth account[0]: ' + submit_acct + ' for contract ' + contract_address);
      });
    }
    catch(error) {
      console.log(error);
    }

    for(let i = 0; i < tmp_fqueue.length; i++) {
      // The metadata file is generated on the fly on IPFS before it gets registered 
      let real_fsize = tmp_iqueue[i].size;
      let ipfs_realhash = '' + tmp_iqueue[i].hash;
      let bc_utilities = new bcutils();
      let potential_key = bc_utilities.genRandomKey();
      let min = 128; // you can redefine the range here
      let max = 1024; // you can redefine the range here
      let l_rand = Math.floor(Math.random() * (max - min + 1) + min);
      let ipfssha256 = sha256coder(ipfs_realhash);
      let key2ndIdx = bc_utilities.shuffleString(l_rand + ipfssha256 + sha256coder(potential_key));
      console.log('l_rand=' + l_rand + ' potential_key=' + potential_key + ' ipfssha256='+ipfssha256);
      console.log('key2ndIdx=' + key2ndIdx);
      let ipfsmid = '';
      let ipfsmeta_json = '{'
      + '"description": ' + ipfsmeta
      + '"filesize": ' + real_fsize
      + '"encrypted": ' + ipfssha256
      + '}';
      let ipfsmeta_norm = JSON.stringify(ipfsmeta_json);
      let c_rand = 0;
      let realKey = '';
      let encryptedIPFSHash = '';
      console.log('File JSON metadata=' + ipfsmeta_norm);
      if(typeof bc_queue[ipfssha256] === 'undefined') {
        lib_ipfs.add(Buffer.from(ipfsmeta_norm), { progress: (prog) => console.log('IPFS Metadata uploaded bytes:' + prog) })
        .then((resp) => {
          console.log(resp);
          ipfsmid = resp[0].hash;
          console.log('ipfs metadata hash=' + ipfsmid);
          console.log('Submitted file=' + tmp_fqueue[i].name);
          console.log('IPFS record=https://ipfs.io/ipfs/' + ipfsmid);
          console.log('Registering: ipfsMetadata=' + ipfsmid + ' ipfssha256=' + ipfssha256 + ' ipfsHash=' + ipfs_realhash + ' realFsize=' + real_fsize);
          console.log('Submitting from ' + submit_acct);
          // Store seed to generate remote random number on block chain
          lib_contract.methods.generateLocalRand(key2ndIdx, l_rand).send({
            from: submit_acct
          }, (error, transactionHash) => {
            if(transactionHash) {
              console.log("blockchain confirmed tx=" + transactionHash);
              console.log("generateLocalRand completed for ipfssha256=" + ipfssha256);
            } else {
              console.log("generateLocalRand canceled for ipfssha256=" + ipfssha256);
            }
          }).then(function(){
            // Fetch pseudo random number open secret from block chain
            lib_contract.methods.getLocalRand(key2ndIdx).call({
              from: submit_acct
            }).then(function(result){
              console.log('contract returned random number=' + result);
              c_rand = result;
              realKey = potential_key + c_rand;
              encryptedIPFSHash = crypto_js.AES.encrypt(ipfs_realhash, realKey).toString();
            });
          }).then(function() {
            lib_contract.methods.encryptIPFS(ipfsmid, potential_key, key2ndIdx, encryptedIPFSHash, real_fsize).send({
              from: submit_acct,
              gasPrice: 60000000000,
              gas: 800000
            }, (error, transactionHash) => {
              if(transactionHash) {
                console.log("blockchain confirmed tx=" + transactionHash);
                bc_queue[ipfssha256] = {
                  "ipfsMetaData": ipfsmid,
                  "encryptedIdx": ipfssha256
                };
                console.log("Registration completed for ipfsMetadata=" + bc_queue[ipfssha256].ipfsMetaData + ' encryptedIdx=' + bc_queue[ipfssha256].encryptedIdx);
              } else {
                console.log("Registration canceled for ipfsMetadata=" + ipfsmid + ' encryptedIdx=' + ipfssha256);
              }
            }); //submit to contract
          });
        }).catch((err) => {
          console.error(err);
        }); // end of current file submission and registration
      } else {
        console.log("Skipping file " + tmp_fqueue[i].name + " with same metadata info " + ipfsmid);
      }
    } // end of for loop
  } // end of registerToBC
  /* jshint ignore:end */

  /* jshint ignore:start */
  captureAccessInfo (event) {
    event.stopPropagation();
    event.preventDefault();

    const target = event.target;
    const type = target.type;
    const name = target.name;

    if(type === 'text') {
      console.log('Capturing input from ' + name + ' with value = ' + target.value);
      this.setState({
        [name]: target.value
      });
      return;
    } else {
      console.log('Detect unknown type=' + type + ' with name=' + name);
      return;
    }
  } // end of captureAccessInfo
  /* jshint ignore:end */

  /* jshint ignore:start */
  accessBC (event) {
    let a_ipfsmeta = this.state.access_ipfs_metadata;
    let a_encryptidx = this.state.access_encrypted_idx;
    console.log('Accessing with metadata = ' + a_ipfsmeta + ' and encryptedIdx = ' + a_encryptidx);
    event.preventDefault();
    
    const contract_address= lib_contract.options.address;
    console.log('Identified contract address = ' + contract_address);
    let submit_acct = '';

    try {
      lib_web3.eth.getAccounts( function(err, accounts) { 
        console.log("All available accounts: " + accounts);
        submit_acct = accounts[0];
        console.log('Applying the first eth account[0]: ' + submit_acct + ' for contract ' + contract_address);
      }).then(() => {
        lib_contract.methods.decryptIPFS(a_encryptidx, a_ipfsmeta).send({
          from: submit_acct
        }, (error, transactionHash) => {
          if(transactionHash) {
            console.log("decryptIPFS tx=" + transactionHash);
            } else {
            console.log("decryptIPFS failed for ipfsMetadata=" + a_ipfsmeta + ' encryptedIdx=' + a_encryptidx);
          }
        }).then(() => {
          lib_contract.methods.fetchKeyForIPFS().call({
            from: submit_acct
          }, (error, result) => {
            if(result) {
              console.log("decryptIPFS result ipfshash=" + result[0] + " token_cost=" + result[1]);
              this.setState({['bc_resp_hash']: result[0]});
              } else {
              console.log("decryptIPFS failed for ipfsMetadata=" + a_ipfsmeta + ' encryptedIdx=' + a_encryptidx);
            }
          });
        }); //submit to contract
      });
    }
    catch(error) {
      console.log(error);
    }
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
          When you have completed uploading files and entering descriptions, click on <code>Register on BlockChain</code> to claim your reward.
        </p>
        <Grid fluid>
          <Row className="show-grid">
            <Col>
              <p align="left">
                <b>Registering Files</b>
              </p>
              <p align="left">
                The better you describe your files, the easier others can discover and find it.
              </p>
              <p align="left">
                This helps to increase the chances of rewards and incentives to use your files.
              </p>
              <p align="left">
                <label>
                Enter file description:
                <input type="text" name="ipfs_metadata" placeholder="Enter your description here!"
                  size="20"
                  value={this.state.ipfs_metadata}
                  onChange = {this.captureFileAndMetadata}
                />
                </label>
                <input 
                  type = "file"
                  multiple
                  onChange = {this.captureFileAndMetadata}
                />
              </p>
              <hr width="80%"></hr>
              <p align="left">
                <label>
                Already have an IPFS hash, enter it here:
                <input type="text" name="ipfs_realhash" placeholder="Enter your IPFS Hash here!"
                  size="20"
                  value={this.state.ipfs_realhash}
                  onChange = {this.captureFileAndMetadata}
                />
                </label>
              </p>
              <p align="left">
                <label>
                File Size:
                <input type="text" name="ipfs_filesize" placeholder="File size?"
                  size="20"
                  value={this.state.ipfs_filesize}
                  onChange = {this.captureFileAndMetadata}
                />
                </label>
              </p>
              <p align="left">
                <label>
                IPFS metadata Hash:
                <input type="text" name="ipfs_metahash" placeholder="Enter IPFS metadata hash here"
                  size="20"
                  value={this.state.ipfs_metahash}
                  onChange = {this.captureFileAndMetadata}
                />
                </label>
              </p>
              <Form onSubmit={this.registerToBC}>
                <p align="left">
                  <Button 
                      bsStyle="primary" 
                      type="submit"> 
                      Register on BlockChain 
                  </Button>
                </p>
              </Form>
            </Col>
            <Col>
              <p align="left">
                <b>Accessing Files</b>
              </p>
              <p align="left">
                <label>
                Enter ipfs Metadata Hash:
                <input type="text" name="access_ipfs_metadata" placeholder="Enter your IPFS Metadata Hash here!"
                  size="40"
                  value={this.state.access_ipfs_metadata}
                  onChange = {this.captureAccessInfo}
                />
                </label>
              </p>
              <p align="left">
                <label>
                Enter encrypted Idx:
                <input type="text" name="access_encrypted_idx" placeholder="Enter the encrypted Idx here!"
                  size="40"
                  value={this.state.access_encrypted_idx}
                  onChange = {this.captureAccessInfo}
                />
                </label>
              </p>
              <Form onSubmit={this.accessBC}>
                <p align="left">
                <Button 
                    bsStyle="primary" 
                    type="submit"> 
                    Access File on BlockChain 
                </Button>
                </p>
              </Form>
              <p align="left">
              <label>IPFS hash: </label>
              <a href={'https://ipfs.io/ipfs/' + this.state.bc_resp_hash} target="_blank">{'https://ipfs.io/ipfs/' + this.state.bc_resp_hash}</a>
              </p>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  };
  /* jshint ignore:end */
}

export default App;
