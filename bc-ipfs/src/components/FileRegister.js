import React, { Component } from 'react';
import { Button, Form, FormControl, FormGroup, ControlLabel, Alert, Image } from 'react-bootstrap';

import lib_ipfs from '../utils/lib_ipfs';
import lib_web3 from '../utils/lib_web3';
import lib_contract from '../utils/lib_contract';
import bcutils from '../utils/lib_bcutils';
import sha256coder from '../utils/lib_hash';
import crypto_js from '../utils/lib_crypto';
import { getBMDTokensByFilesize } from '../utils/lib_BMDtoken';

class FileRegister extends Component {
  constructor() {
    super();
    // define our states to keep track
    this.state = {
      file_description: '',
      file_category: 'data',
      ipfs_realhash: '',
      file_size: 0,
      register_result_show: false,
      btn_register_disabled: false,
      error_msg: '',
      error_msg_show: false,
      file_obj: {},
      file_ipfs_hash: '',
      bc_register_resp: undefined, // per entry is {"ipfsMetaData":"", "encryptedIdx":""}
    };

    // this.bc_register = [];

    this.captureFileAndMetadata = this.captureFileAndMetadata.bind(this);
    this.saveToIpfs = this.saveToIpfs.bind(this);
    this.registerToBC = this.registerToBC.bind(this);
    this.displayErrorMsg = this.displayErrorMsg.bind(this);
    this.handleErrorMsgDismiss = this.handleErrorMsgDismiss.bind(this);
  }

  displayErrorMsg(msg) {
    this.setState({ ['error_msg']: msg });
    this.setState({ ['error_msg_show']: true });
  }

  saveToIpfs(reader) {
    let ipfsId;
    let fsize;
    const buffer = Buffer.from(reader.result);

    // disable register button until real file uploaded.
    this.setState({ ['btn_register_disabled']: true });

    lib_ipfs
      .add(buffer, {
        progress: prog => console.log('IPFS uploaded bytes:' + prog),
      })
      .then(response => {
        console.log(response);
        ipfsId = response[0].hash;
        fsize = response[0].size;
        console.log('ipfs hash=' + ipfsId);
        console.log('ipfs fsize=' + fsize);
        this.setState({ ['btn_register_disabled']: false, ['file_ipfs_hash']: response[0] });
      })
      .catch(err => {
        console.error(err);
        this.setState({ ['btn_register_disabled']: false });
      });
  }

  captureFileAndMetadata(event) {
    event.stopPropagation();
    event.preventDefault();
    const func_ptn = this.saveToIpfs;

    const target = event.target;
    const type = target.type;
    const name = target.name;

    if (type === 'text' || type === 'textarea' || type === 'select-one') {
      console.log('Capturing input from ' + name + ' with value = ' + target.value);
      this.setState({
        [name]: target.value,
      });
      return;
    } else if (type === 'file') {
      console.log('Detectuser is trying to select files to upload!');
      // clear previous uploaded data.
      this.setState({ ['register_result_show']: false, ['file_ipfs_hash']: '', ['file_obj']: {}, ['bc_register_resp']: undefined });
      if (event.target.files && event.target.files[0] != undefined) {
        // only support one file upload, so take first file.
        let f = event.target.files[0];
        this.setState({ ['file_obj']: f });
  
        let reader = new window.FileReader();
        console.log('Loading file ' + f.name);
  
        /*jshint ignore:start*/
        reader.onload = () => func_ptn(reader);
        /*jshint ignore:end*/
        reader.readAsArrayBuffer(f); // load file into browser's memory as blob
      } else {
        console.log('No file has been uploaded yet!');
      }
    } else {
      console.log('Detect unknown type=' + type + ' with name=' + name);
      return;
    }
  }

  /* jshint ignore:start */
  registerToBC(event) {
    this.setState({ ['btn_register_disabled']: true });
    event.preventDefault();
    let fileDescription = this.state.file_description;
    let fileCategory = this.state.file_category;
    console.log('Submitting with fileCategory = ' + fileCategory + 'fileDescription = ' + fileDescription);
    const file_obj = this.state.file_obj;

    const contract_address = lib_contract.options.address;
    console.log('Identified contract address = ' + contract_address);
    let submit_acct = '';

    if (typeof file_obj.name === undefined) {
      // no file selected
      this.setState({ ['btn_register_disabled']: false });
      // display error msg
      this.displayErrorMsg('No file selected');
    } else {
      // The metadata file is generated on the fly on IPFS before it gets registered
      let real_fsize = file_obj.size;
      let ipfs_realhash = '' + this.state.ipfs_realhash;
      let bc_utilities = new bcutils();
      let potential_key = bc_utilities.genRandomKey();
      let min = 128; // you can redefine the range here
      let max = 1024; // you can redefine the range here
      let l_rand = Math.floor(Math.random() * (max - min + 1) + min);
      let ipfssha256 = sha256coder(ipfs_realhash);
      let key2ndIdx = bc_utilities.shuffleString(l_rand + ipfssha256 + sha256coder(potential_key));
      console.log('l_rand=' + l_rand + ' potential_key=' + potential_key + ' ipfssha256=' + ipfssha256);
      console.log('key2ndIdx=' + key2ndIdx);
      let ipfsmid = '';
      let c_rand = 0;
      let realKey = '';
      let encryptedIPFSHash = '';
      if (typeof this.state.bc_register_resp === 'undefined') {
        lib_web3.eth
          .getAccounts(function(err, accounts) {
            if(err) {
              this.displayErrorMsg('No available Ethereum wallet account.');
              console.error(err);
            } else {
              console.log('All available accounts: ' + accounts);
              submit_acct = accounts[0];
              console.log('Applying the first eth account[0]: ' + submit_acct + ' for contract ' + contract_address);
              console.log('Submitting from ' + submit_acct);
            }
          })
          .then(() => {
            c_rand = Math.floor(l_rand / 13);
            realKey = potential_key + c_rand;
            encryptedIPFSHash = crypto_js.AES.encrypt(ipfs_realhash, realKey).toString();
            let ipfsmeta_json = {
              description: fileDescription,
              category: fileCategory,
              filesize: real_fsize,
              encrypted: encryptedIPFSHash,
            };
            let ipfsmeta_norm = JSON.stringify(ipfsmeta_json);
            console.log('File JSON metadata=' + ipfsmeta_norm);
            lib_ipfs
              .add(Buffer.from(ipfsmeta_norm), {
                progress: prog => console.log('IPFS Metadata uploaded bytes:' + prog),
              })
              .then(resp => {
                console.log(resp);
                ipfsmid = resp[0].hash;
                console.log('ipfs metadata hash=' + ipfsmid);
                console.log('Submitted file=' + file_obj.name);
                console.log('IPFS record=https://ipfs.io/ipfs/' + ipfsmid);
                console.log(
                  'Registering: ipfsMetadata=' +
                    ipfsmid +
                    ' encryptedRealIPFS=' +
                    encryptedIPFSHash +
                    ' ipfsRealHash=' +
                    ipfs_realhash +
                    ' realFsize=' +
                    real_fsize,
                );
                console.log('Submitting from ' + submit_acct);
                console.log('Pinning to IPFS ' + ipfsmid);
                lib_ipfs.pin.add(ipfsmid).then(resp => {
                  console.log('ipfs metadata has been pinned ' + ipfsmid);
                  console.log(resp);
                })
                .catch(err => {
                  this.displayErrorMsg(err.message);
                  console.error(err);
                }); // end of lib_contract.methods.encryptIPFS; //End of lib_ipfs.pin.add
                lib_contract.methods
                  .encryptIPFS(ipfsmid, potential_key, key2ndIdx, l_rand, encryptedIPFSHash, real_fsize)
                  .send(
                    {
                      from: submit_acct,
                      gasPrice: 2000000000,
                      gas: 1500000,
                    },
                    (error, transactionHash) => {
                      if (transactionHash) {
                        console.log('blockchain confirmed tx=' + transactionHash);
                        this.setState({ ['bc_register_resp']: {
                          ipfsMetaData: ipfsmid,
                          encryptedIdx: ipfssha256,
                        }});
                        console.log(
                          'Registration completed for ipfsMetadata=' +
                            ipfsmid +
                            ' encryptedIdx=' +
                            ipfssha256,
                        );
                        this.setState({ ['register_result_show']: true });
                        this.setState({ ['file_size']: real_fsize });
                      } else {
                        this.displayErrorMsg('Registration canceled.');
                        console.log(
                          'Registration canceled for ipfsMetadata=' + ipfsmid + ' encryptedIdx=' + ipfssha256,
                        );
                      }
                    },
                  )
                  .catch(err => {
                    this.displayErrorMsg(err.message);
                    console.error(err);
                  }); // end of lib_contract.methods.encryptIPFS
              }); // end of ipfs.add()
          }).catch(err => {
            // getAccounts error
            this.displayErrorMsg(err.message);
            console.error(err);
          })
          .then(() => {
            this.setState({ ['btn_register_disabled']: false });
          }); // end of getAccounts and current file submission and registration
      } else {
        console.log('Skipping file ' + file_obj.name + ' with same metadata info ' + ipfsmid);
        this.setState({ ['btn_register_disabled']: false });
      }
    } // end of for loop

  } // end of registerToBC
  /* jshint ignore:end */


  handleErrorMsgDismiss() {
    this.setState({ error_msg_show: false, error_msg: '' });
  }


  /* jshint ignore:start */
  render() {
    return (
      <div>
        <p align="left">The better you describe your files, the easier others can discover and find it.</p>
        <p align="left">This helps to increase the chances of rewards and incentives to use your files.</p>
        <Form onSubmit={this.registerToBC} align="left">
          <FormGroup controlId="formFileCategory">
            <ControlLabel>Select file category:</ControlLabel>
            <FormControl
              componentClass="select"
              placeholder="file category"
              name="file_category"
              onChange={this.captureFileAndMetadata}
              style={{ width: '200px' }}
            >
              <option value="data">Data</option>
              <option value="code">Code</option>
            </FormControl>
          </FormGroup>
          <FormGroup controlId="formFileDescription">
            <ControlLabel>Enter file description:</ControlLabel>
            <FormControl
              componentClass="textarea"
              type="text"
              name="file_description"
              value={this.state.file_description}
              placeholder="Enter your description here!"
              onChange={this.captureFileAndMetadata}
            />
            <FormControl.Feedback />
          </FormGroup>

          <FormGroup controlId="formFile">
            <FormControl type="file" onChange={this.captureFileAndMetadata} />
          </FormGroup>

          <Button bsSize="xsmall" disabled={this.state.btn_register_disabled || this.state.file_ipfs_hash==''} bsStyle="primary" type="submit">
            Register on BlockChain
          </Button>
          <Image
            src="loading.gif"
            height="50px"
            width="50px"
            style={{ display: !this.state.btn_register_disabled ? 'none' : 'inline' }}
          />
          <p />
          <Alert bsStyle="danger" style={{ display: this.state.error_msg_show ? 'block' : 'none' }}>
            <p>{this.state.error_msg}</p>
            <Button bsStyle="danger" onClick={this.handleErrorMsgDismiss}>OK</Button>
          </Alert>
          <Alert bsStyle="success" style={{ display: this.state.register_result_show ? 'block' : 'none' }}>
            Thanks for your participation. You will get{' '}
            <strong>{getBMDTokensByFilesize(this.state.file_size)} BMD tokens</strong> as your file register reward.
          </Alert>
        </Form>
      </div>
    );
  }
  /* jshint ignore:end */
}

export default FileRegister;
