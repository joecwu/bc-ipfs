import React, { Component } from 'react';
import { Button, Image } from 'react-bootstrap';
import lib_web3 from '../utils/lib_web3';
import lib_contract from '../utils/lib_contract';
import crypto_js from '../utils/lib_crypto';
import Bytes from './Bytes';
import BMDTokens from './BMDTokens';
import { getBMDTokensByTokenCost } from '../utils/lib_BMDtoken';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

var PropTypes = require('prop-types');
const bc_resp_hash_default = '*******';

class FileListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bc_resp_hash: bc_resp_hash_default,
      btn_access_state: 'normal', //normal, accessing ,accessed
    };
    this.handleAccessFile = this.handleAccessFile.bind(this);
    this.bcAccessFile = this.bcAccessFile.bind(this);
  }

  /*jshint ignore:start*/
  handleAccessFile(event) {
    if (this.state.btn_access_state == 'accessed') {
      // open file directly
      window.open('https://cloudflare-ipfs.com/ipfs/' + this.state.bc_resp_hash, '_blank');
    } else {
      confirmAlert({
        title: 'Confirm to access',
        message: `Access this file will cost ${getBMDTokensByTokenCost(
          this.props.tokenCost,
        )} BMD tokens, click 'Yes' to access or 'No' to cancel.`,
        buttons: [
          {
            label: 'Yes',
            onClick: () => this.bcAccessFile(event),
          },
          {
            label: 'No',
            onClick: () => {},
          },
        ],
      });
    }
  }
  /*jshint ignore:end*/

  /*jshint ignore:start*/
  bcAccessFile(event) {
    this.setState({ ['bc_resp_hash']: '*******' });
    this.setState({ ['btn_access_state']: 'accessing' });
    let a_ipfsmeta = this.props.hashId;
    let a_encrypted_hash = '';
    console.log('Accessing with metadata = ' + a_ipfsmeta + ' and encryptedTxt = ' + a_encrypted_hash);
    event.preventDefault();

    const contract_address = lib_contract.options.address;
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
          lib_contract.methods
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
                  this.setState({ ['btn_access_state']: 'normal' });
                }
              },
            )
            .then(() => {
              let realKey = '';
              let decryptIPFSHash = '';
              lib_contract.methods
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
                      try {
                        realKey = result[0] + '' + result[1];
                        decryptIPFSHash = crypto_js.AES.decrypt(result[2], realKey).toString(crypto_js.enc.Utf8);
                        a_encrypted_hash = result[2];
                      } catch (err) {
                        console.error(err);
                      }
                    } else {
                      console.log(
                        'decryptIPFS failed for ipfsMetadata=' + a_ipfsmeta + ' encryptedHash=' + a_encrypted_hash,
                      );
                    }
                  },
                )
                .then(() => {
                  if (decryptIPFSHash != '') {
                    this.setState({ ['btn_access_state']: 'accessed' });
                    console.log('decrypted text shows real IPFS hash: ' + decryptIPFSHash);
                    this.setState({ ['bc_resp_hash']: decryptIPFSHash });
                    this.setState({ ['access_encrypted_hash']: a_encrypted_hash });
                  } else {
                    console.log('decrypted text shows real IPFS hash: ' + decryptIPFSHash);
                    this.setState({ ['btn_access_state']: 'normal' });
                  }
                });
            }); //submit to contract
        });
    } catch (error) {
      console.log(error);
      this.setState({ ['btn_access_state']: 'normal' });
    }
  }
  /*jshint ignore:end*/

  render() {
    const { hashId, description, category, fileSize, tokenCost, noOfAccessed } = this.props;

    let btn_access_text = 'Access File';
    if (this.state.btn_access_state == 'accessed') {
      btn_access_text = 'Download File';
    } else if (this.state.btn_access_state == 'accessing') {
      btn_access_text = 'Accessing';
    }
    /*jshint ignore:start*/
    return (
      <tr>
        {this.props.hideFields.includes('accessFile') ? null : (
          <td style={{ whiteSpace: 'nowrap' }}>
            <Button
              bsStyle="primary"
              bsSize="xs"
              disabled={this.state.btn_access_state == 'accessing'}
              onClick={this.handleAccessFile}
            >
              {btn_access_text}
            </Button>
            <Image
              src="loading.gif"
              height="30px"
              width="30px"
              style={{ display: this.state.btn_access_state != 'accessing' ? 'none' : 'inline' }}
            />
          </td>
        )}
        {this.props.hideFields.includes('description') ? null : <td>{description}</td>}
        {this.props.hideFields.includes('category') ? null : <td style={{ whiteSpace: 'nowrap' }}>{category}</td>}
        {this.props.hideFields.includes('fileSize') ? null : (
          <td style={{ whiteSpace: 'nowrap' }}>
            <Bytes bytes={fileSize} />
          </td>
        )}
        {this.props.hideFields.includes('tokenCost') ? null : (
          <td style={{ whiteSpace: 'nowrap' }}>
            <BMDTokens value={tokenCost} />
          </td>
        )}
        {this.props.hideFields.includes('noOfAccessed') ? null : (
          <td style={{ whiteSpace: 'nowrap' }}>{noOfAccessed}</td>
        )}
      </tr>
    );
    /*jshint ignore:end*/
  }
}

FileListItem.propTypes = {
  hideFields: PropTypes.arrayOf(PropTypes.string),
  hashId: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  category: PropTypes.string,
  fileSize: PropTypes.number.isRequired,
  tokenCost: PropTypes.string.isRequired,
  noOfAccessed: PropTypes.number,
};

FileListItem.defaultProps = {
  hideFields: [],
  noOfAccessed: 0,
};

export default FileListItem;
