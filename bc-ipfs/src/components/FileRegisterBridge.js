import React, { Component } from 'react';
import { Button, Form, FormControl, FormGroup, ControlLabel, Alert, Image } from 'react-bootstrap';

import lib_web3 from '../utils/lib_web3';
import lib_reward_contract from '../utils/lib_reward_contract';
import bcutils from '../utils/lib_bcutils';
import sha256coder from '../utils/lib_hash';
import crypto_js from '../utils/lib_crypto';
var PropTypes = require('prop-types');
import { getBMDTokensByFilesize } from '../utils/lib_token';

class FileRegisterBridge extends Component {
  constructor() {
    super();
    // define our states to keep track
    this.state = {
      file_description: '',
      file_category: 'data',
      ipfs_gen_metatext: '',
      ipfs_realhash: '',
      ipfs_filesize: '',
      file_size: 0,
      register_result_show: false,
      btn_register_disabled: false,
      ipfs_realhash_disabled: false,
      ipfs_filesize_disabled: false,
      file_category_disabled: false,
      error_msg: '',
      error_msg_show: false,
      info_msg: '',
      info_msg_show: false,
    };

    // The order/index in these queue matters
    this.idx_queue = []; // keep track of duplicates
    this.file_queue = [];
    this.ipfshash_queue = [];

    this.captureFileAndMetadata = this.captureFileAndMetadata.bind(this);
    this.manualRegisterToBC = this.manualRegisterToBC.bind(this);
    this.displayErrorMsg = this.displayErrorMsg.bind(this);
    this.handleErrorMsgDismiss = this.handleErrorMsgDismiss.bind(this);
  }

  componentDidMount() {
    if (this.props.hashId) {
      this.setState({ ['ipfs_realhash']: this.props.hashId, ['ipfs_realhash_disabled']: true });
    }
    if (this.props.fileSize) {
      this.setState({ ['ipfs_filesize']: Number(this.props.fileSize), ['ipfs_filesize_disabled']: true });
      // show file reward in the begining
      // this.setState({ ['file_size']: this.props.fileSize, ['register_result_show']: true });
    }
    if (this.props.category) {
      this.setState({ ['file_category']: this.props.category, ['file_category_disabled']: true });
    }
    if (this.props.description) {
      this.setState({ ['file_description']: this.props.description });
    }
  }

  displayErrorMsg(msg) {
    this.setState({ ['error_msg']: msg });
    this.setState({ ['error_msg_show']: true });
  }

  captureFileAndMetadata(event) {
    event.stopPropagation();
    event.preventDefault();
    const dqueue = this.idx_queue;
    const tmp_fqueue = this.file_queue;
    const tmp_iqueue = this.ipfshash_queue;
    const func_ptn = this.saveToIpfs;

    const target = event.target;
    const type = target.type;
    const name = target.name;

    if (type === 'text' || type === 'textarea' || type === 'select-one') {
      console.debug('Capturing input from ' + name + ' with value = ' + target.value);
      this.setState({
        [name]: target.value,
      });
      return;
    } else {
      console.log('Detect unknown type=' + type + ' with name=' + name);
      return;
    }
  }

  /* jshint ignore:start */
  manualRegisterToBC(event) {
    this.setState({ ['btn_register_disabled']: true });
    this.setState({ ['register_result_show']: false });
    this.setState({
      ['info_msg']: "waiting for wallet transaction's approval and complete...",
      ['info_msg_show']: true,
    });
    event.preventDefault();
    let fileDescription = this.state.file_description;
    let fileCategory = this.state.file_category;
    // single file upload and registration only
    const contract_address = lib_reward_contract.options.address;
    console.log('Identified contract address = ' + contract_address);
    let submit_acct = '';
    let ipfs_realhash = this.state.ipfs_realhash;
    let real_fsize = this.state.ipfs_filesize;
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
    lib_web3.eth
      .getAccounts(function(err, accounts) {
        if (err) {
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
        console.log('Real ipfs ' + ipfs_realhash + ' encrypted to =' + encryptedIPFSHash);
        let ipfsmeta_json = {
          description: fileDescription,
          category: fileCategory,
          filesize: real_fsize,
          encrypted: encryptedIPFSHash,
        };
        let ipfsmeta_norm = JSON.stringify(ipfsmeta_json);
        console.log('generated JSON for manual registration ' + ipfsmeta_norm);
        this.setState({ ['ipfs_gen_metatext']: ipfsmeta_norm });
      })
      .then(() => {
        lib_reward_contract.methods
          .encryptIPFS(ipfsmid, potential_key, key2ndIdx, l_rand, encryptedIPFSHash, real_fsize)
          .send(
            {
              from: submit_acct,
              gasPrice: CONFIG.ethereum.reward_contract.gasPrice,
              gas: CONFIG.ethereum.reward_contract.gas,
            },
            (error, transactionHash) => {
              if (transactionHash) {
                this.setState({ ['register_result_show']: true });
                this.setState({ ['file_size']: real_fsize });
                console.log('blockchain confirmed tx=' + transactionHash);
                console.log(
                  'Registration completed for ipfsMetadata=' + ipfsmid + ' encryptedText=' + encryptedIPFSHash,
                );
              } else {
                this.displayErrorMsg(error.message);
                console.log(
                  'Registration canceled for ipfsMetadata=' + ipfsmid + ' encryptedText=' + encryptedIPFSHash,
                );
              }
            },
          )
          .catch(err => {
            console.error(err);
            this.displayErrorMsg(err.message);
            this.setState({ ['register_result_show']: false });
          })
          .then(() => {
            this.setState({ ['btn_register_disabled']: false });
            this.setState({ ['info_msg']: '', ['info_msg_show']: false });
          }); // end of lib_reward_contract.methods.encryptIPFS
      });
  }
  /* jshint ignore:end */

  handleErrorMsgDismiss() {
    this.setState({ error_msg_show: false, error_msg: '' });
  }

  /* jshint ignore:start */
  render() {
    return (
      <Form onSubmit={this.manualRegisterToBC}>
        <FormGroup controlId="formIPFSHash" validationState={null}>
          <ControlLabel>IPFS hash</ControlLabel>
          <FormControl
            type="text"
            disabled={this.state.ipfs_realhash_disabled}
            name="ipfs_realhash"
            placeholder="Enter your IPFS Hash here!"
            value={this.state.ipfs_realhash}
            onChange={this.captureFileAndMetadata}
          />
        </FormGroup>
        <FormGroup controlId="formFileSize" validationState={null}>
          <ControlLabel>File Size</ControlLabel>
          <FormControl
            type="text"
            disabled={this.state.ipfs_filesize_disabled}
            name="ipfs_filesize"
            placeholder="Enter your file size here!"
            value={this.state.ipfs_filesize}
            onChange={this.captureFileAndMetadata}
          />
        </FormGroup>
        <FormGroup controlId="formFileCategory">
          <ControlLabel>Select file category: </ControlLabel>
          <FormControl
            componentClass="select"
            disabled={this.state.file_category_disabled}
            placeholder="file category"
            name="file_category"
            onChange={this.captureFileAndMetadata}
            style={{ width: '200px' }}
            value={this.state.file_category}
          >
            <option value="data">Data</option>
            <option value="code">Code</option>
          </FormControl>
        </FormGroup>
        <FormGroup controlId="formFileDescription">
          <ControlLabel>Enter file description: </ControlLabel>
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
        <Button disabled={this.state.btn_register_disabled} bsStyle="primary" type="submit">
          Continued to register to BlockChain
        </Button>
        <Image
          src="loading.gif"
          height="50px"
          width="50px"
          style={{ display: !this.state.btn_register_disabled ? 'none' : 'inline' }}
        />
        <Alert bsStyle="info" style={{ display: this.state.info_msg_show ? 'block' : 'none' }}>
          <p>{this.state.info_msg}</p>
        </Alert>
        <p />
        <Alert bsStyle="danger" style={{ display: this.state.error_msg_show ? 'block' : 'none' }}>
          <p>{this.state.error_msg}</p>
          <p />
          <Button bsStyle="danger" onClick={this.handleErrorMsgDismiss}>
            OK
          </Button>
        </Alert>
        <Alert bsStyle="success" style={{ display: this.state.register_result_show ? 'block' : 'none' }}>
          Thanks for your participation. You will get{' '}
          <strong>{getBMDTokensByFilesize(this.state.file_size)} BMD tokens</strong> as your file register reward.
          <br />
          <strong>Tips:</strong> Click{' '}
          <a
            href="https://github.com/BlockMedical/BlockMedical/blob/master/docs/metamaskdocs/add_token_symboles/README.md"
            target="_blank"
          >
            here
          </a>{' '}
          to see how to add symbol to your wallet.
        </Alert>
      </Form>
    );
  }
  /* jshint ignore:end */
}

FileRegisterBridge.propTypes = {
  hashId: PropTypes.string,
  description: PropTypes.string,
  category: PropTypes.string,
  fileSize: PropTypes.number,
};

export default FileRegisterBridge;
