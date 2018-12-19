import React, { Component } from 'react';
import { Button, Form, Grid, Row, Col, Image } from 'react-bootstrap';

import lib_web3 from '../utils/lib_web3';
import lib_reward_contract from '../utils/lib_reward_contract';
import crypto_js from '../utils/lib_crypto';

class FileAccessManually extends Component {
  constructor() {
    super();
    // define our states to keep track
    this.state = {
      access_ipfs_metadata: '',
      access_encrypted_hash: '',
      bc_resp_hash: '*******',
      btn_access_disabled: false,
    };

    this.captureAccessInfo = this.captureAccessInfo.bind(this);
    this.accessBC = this.accessBC.bind(this);
  }

  /* jshint ignore:start */
  captureAccessInfo(event) {
    event.stopPropagation();
    event.preventDefault();

    const target = event.target;
    const type = target.type;
    const name = target.name;

    if (type === 'text') {
      console.log('Capturing input from ' + name + ' with value = ' + target.value);
      this.setState({
        [name]: target.value,
      });
      return;
    } else {
      console.log('Detect unknown type=' + type + ' with name=' + name);
      return;
    }
  } // end of captureAccessInfo
  /* jshint ignore:end */

  /* jshint ignore:start */
  accessBC(event) {
    this.setState({ ['bc_resp_hash']: '*******' });
    this.setState({ ['btn_access_disabled']: true });
    let a_ipfsmeta = this.state.access_ipfs_metadata;
    let a_encrypted_hash = this.state.access_encrypted_hash;
    console.log('Accessing with metadata = ' + a_ipfsmeta + ' and encryptedTxt = ' + a_encrypted_hash);
    event.preventDefault();

    const contract_address = lib_reward_contract.options.address;
    console.log('Identified contract address = ' + contract_address);
    let submit_acct = '';

    try {
      lib_web3.eth
        .getAccounts(function(err, accounts) {
          console.log('All available accounts: ' + accounts);
          submit_acct = accounts[0];
          console.log('Applying the first eth account[0]: ' + submit_acct + ' for contract ' + contract_address);
        })
        .then(() => {
          lib_reward_contract.methods
            .decryptIPFS(a_ipfsmeta)
            .send(
              {
                from: submit_acct,
              },
              (error, transactionHash) => {
                if (transactionHash) {
                  console.log('decryptIPFS tx=' + transactionHash);
                } else {
                  console.log('decryptIPFS failed for ipfsMetadata=' + a_ipfsmeta);
                  this.setState({ ['btn_access_disabled']: false });
                }
              },
            )
            .then(() => {
              let realKey = '';
              let decryptIPFSHash = '';
              lib_reward_contract.methods
                .fetchKeyForIPFS()
                .call(
                  {
                    from: submit_acct,
                  },
                  (error, result) => {
                    if (result) {
                      console.log(
                        'fetching decrypted 1st_partial_key=' +
                          result[0] +
                          ' 2nd_partial_key=' +
                          result[1] +
                          ' encryptedHash=' +
                          result[2] +
                          ' cost=' +
                          result[3],
                      );
                      realKey = result[0] + '' + result[1];
                      decryptIPFSHash = crypto_js.AES.decrypt(result[2], realKey).toString(crypto_js.enc.Utf8);
                      a_encrypted_hash = result[2];
                    } else {
                      console.log(
                        'decryptIPFS failed for ipfsMetadata=' + a_ipfsmeta + ' encryptedHash=' + a_encrypted_hash,
                      );
                    }
                  },
                )
                .then(() => {
                  this.setState({ ['btn_access_disabled']: false });
                  console.log('decrypted text shows real IPFS hash: ' + decryptIPFSHash);
                  this.setState({ ['bc_resp_hash']: decryptIPFSHash });
                  this.setState({
                    ['access_encrypted_hash']: a_encrypted_hash,
                  });
                });
            }); //submit to contract
        });
    } catch (error) {
      console.log(error);
      this.setState({ ['btn_access_disabled']: false });
    }
  }

  /* jshint ignore:start */
  render() {
    return (
      <div className="App">
        <p align="left">
          <b>Accessing Files</b>
        </p>
        <p align="left">
          <label>
            Enter ipfs Metadata Hash:
            <input
              type="text"
              name="access_ipfs_metadata"
              placeholder="Enter your IPFS Metadata Hash here!"
              size="40"
              value={this.state.access_ipfs_metadata}
              onChange={this.captureAccessInfo}
            />
          </label>
        </p>
        <p align="left">
          <label>
            Enter encrypted IPFS Hash:
            <input
              type="text"
              name="access_encrypted_hash"
              placeholder="Enter the encrypted text here!"
              size="40"
              value={this.state.access_encrypted_hash}
              onChange={this.captureAccessInfo}
            />
          </label>
        </p>
        <Form onSubmit={this.accessBC}>
          <p align="left">
            <Button bsSize="xsmall" disabled={this.state.btn_access_disabled} bsStyle="primary" type="submit">
              Access File on BlockChain
            </Button>
            <Image
              src="loading.gif"
              height="50px"
              width="50px"
              style={{ display: !this.state.btn_access_disabled ? 'none' : 'inline' }}
            />
          </p>
        </Form>
        <p align="left">
          <label>IPFS hash: </label>
          <a href={CONFIG.ipfs.gateway_url + this.state.bc_resp_hash} target="_blank">
            {CONFIG.ipfs.gateway_url + this.state.bc_resp_hash}
          </a>
        </p>
      </div>
    );
  }
  /* jshint ignore:end */
}

export default FileAccessManually;
