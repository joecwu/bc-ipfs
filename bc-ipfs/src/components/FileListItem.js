import React, { Component } from 'react';
import { Button, Image } from 'react-bootstrap';
import lib_web3 from '../utils/lib_web3';
import lib_reward_contract from '../utils/lib_reward_contract';
import { crypto_js, EncryptionVersion } from '../utils/lib_crypto';
import Bytes from './Bytes';
import DateTime from './DateTime';
import BMDTokens from './BMDTokens';
import { div18decimals } from '../utils/lib_token';
import { confirmAlert } from 'react-confirm-alert';
import isMobile from '../utils/lib_user_agent';

var PropTypes = require('prop-types');
const bc_resp_hash_default = '*******';

class FileListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hashId: this.props.hashId,
      bc_resp_hash: bc_resp_hash_default,
      btn_access_state: 'normal', //normal, accessing ,accessed, error
    };
    this.handleAccessFile = this.handleAccessFile.bind(this);
    this.bcAccessFile = this.bcAccessFile.bind(this);
    this.setupWebViewJavascriptBridge = this.setupWebViewJavascriptBridge.bind(this);
    this.fileListItemFetchKeyForIPFS = this.fileListItemFetchKeyForIPFS.bind(this);
  }

  componentDidMount() {
    const { hashId } = this.state;

    this.setupWebViewJavascriptBridge(bridge => {
      const key = 'FileListItemFetchKeyForIPFS-' + hashId;
      bridge.registerHandler(key, (data, responseCallback) => {
        console.log('FileListItemFetchKeyForIPFS ipfsMetadataHash from iOS ' + data.ipfsMetadataHash);
        this.fileListItemFetchKeyForIPFS();
        let responseData = { 'callback from JS': 'FileListItemFetchKeyForIPFS' };
        responseCallback(responseData);
      });
    });
  }

  setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    let WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';
    // WVJBIframe.src = ‘wvjbscheme://__BRIDGE_LOADED__’;
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(() => {
      document.documentElement.removeChild(WVJBIframe);
    }, 0);
  }

  /*jshint ignore:start*/
  handleAccessFile(event) {
    if (this.state.btn_access_state === 'accessed') {
      if (!isMobile.any()) {
        // open file directly
        window.open(CONFIG.ipfs.gateway_url + this.state.bc_resp_hash, '_blank');
      } else {
        let url = CONFIG.ipfs.gateway_url + this.state.bc_resp_hash;
        this.setupWebViewJavascriptBridge(bridge => {
          bridge.callHandler('FileListItemDownloadFileButtonDidTap', url, response => {
            console.log('callback from iOS ' + response);
          });
        });
      }
    } else {
      confirmAlert({
        title: 'Confirm to access',
        message: `Access this file will cost ${div18decimals(
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
    event.persist();

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
                  const { hashId } = this.state;

                  console.log('decryptIPFS tx=' + transactionHash);
                  this.setupWebViewJavascriptBridge(bridge => {
                    bridge.callHandler(
                      'FileListItemAccessButtonDidTap',
                      { [transactionHash]: { type: 'accessFile', hashId: hashId } },
                      response => {
                        console.log('callback from iOS ' + response);
                      },
                    );
                  });
                } else {
                  console.log('decryptIPFS failed for ipfsMetadata=' + a_ipfsmeta);
                  // If error occurs here, it means we didn't even generate a tx due to
                  // wallet locked, network issues, etc.
                  this.setState({ ['btn_access_state']: 'normal' });
                }
              },
            )
            .catch(err => {
              this.setState({ ['btn_access_state']: 'error' });
              console.error('err = ' + err);
              confirmAlert({
                title: 'Error',
                message: `Either you ran out of gas, or your wallet does not have sufficient BMD tokens, or the transaction was rejected`,
                buttons: [
                  {
                    label: 'Got it!',
                    onClick: () => {},
                  },
                ],
              });
            })
            .then(() => {
              if (this.state.btn_access_state != 'error') {
                let realKey = '';
                let decryptIPFSHash = '';
                console.log('Fetching pp metadata ' + a_ipfsmeta);
                lib_reward_contract.methods
                  .fetchParallelKeyForIPFS(a_ipfsmeta)
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
                          decryptIPFSHash = crypto_js.AES.decrypt('' + result[2], realKey).toString(crypto_js.enc.Utf8);
                          a_encrypted_hash = result[2];
                          console.log('ipfs=' + decryptIPFSHash);
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
                    if (decryptIPFSHash != '' && this.state.btn_access_state != 'error') {
                      this.setState({ ['btn_access_state']: 'accessed' });
                      console.log('decrypted text shows real IPFS hash: ' + decryptIPFSHash);
                      this.setState({ ['bc_resp_hash']: decryptIPFSHash });
                      this.setState({ ['access_encrypted_hash']: a_encrypted_hash });
                    } else {
                      console.log('decrypted text failed, invalild, or empty, real IPFS hash: ' + decryptIPFSHash);
                      this.setState({ ['btn_access_state']: 'error' });
                    }
                  });
              } else {
                console.log('decryptIPFS failed, do not fetch!');
              }
            }); //submit to contract
        });
    } catch (error) {
      console.log(error);
      this.setState({ ['btn_access_state']: 'error' });
    }
  }
  /*jshint ignore:end*/

  /* jshint ignore:start */
  fileListItemFetchKeyForIPFS() {
    let a_encrypted_hash = '';
    let submit_acct = '';

    try {
      lib_web3.eth
        .getAccounts(function(err, accounts) {
          console.log('All available accounts: ' + accounts);
          submit_acct = accounts[0];
          console.log('Applying the first eth account[0]: ' + submit_acct);
        })
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
                  try {
                    realKey = result[0] + '' + result[1];
                    switch (this.props.encryptionVersion) {
                      case EncryptionVersion.CryptoJs:
                        decryptIPFSHash = crypto_js.AES.decrypt('' + result[2], realKey).toString(crypto_js.enc.Utf8);
                        break;
                      default:
                        decryptIPFSHash = crypto_js.AES.decrypt('' + result[2], realKey).toString(crypto_js.enc.Utf8);
                    }
                    a_encrypted_hash = result[2];
                    console.log('ipfs=' + decryptIPFSHash);
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
                console.log('decrypted text failed, invalild, or empty, real IPFS hash: ' + decryptIPFSHash);
                this.setState({ ['btn_access_state']: 'normal' });
              }
            });
        }); //submit to contract
    } catch (error) {
      // the error occurs here is probably something we don't care, we just need to retry
      console.log(error);
      // TODO: This should be a simple re-try that does not cost any eth gas
      this.setState({ ['btn_access_state']: 'normal' });
    }
  }
  /*jshint ignore:end*/

  render() {
    const {
      hashId,
      description,
      category,
      fileSize,
      tokenCost,
      metadataCaptureTime,
      latestPurchaseTime,
      noOfAccessed,
      encryptionVersion,
    } = this.props;

    let btn_access_text = 'Access File';
    if (this.state.btn_access_state === 'accessed') {
      btn_access_text = 'Open / Download';
    } else if (this.state.btn_access_state === 'accessing') {
      btn_access_text = 'Accessing';
    } else if (this.state.btn_access_state === 'error') {
      btn_access_text = 'Error / Retry';
    } else {
      btn_access_text = 'Access File';
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
        {this.props.hideFields.includes('metadataCaptureTime') ? null : (
          <td style={{ whiteSpace: 'nowrap' }}>
            <DateTime value={metadataCaptureTime} />
          </td>
        )}
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
        {this.props.hideFields.includes('latestPurchaseTime') ? null : (
          <td style={{ whiteSpace: 'nowrap' }}>
            <DateTime value={latestPurchaseTime} />
          </td>
        )}
        {this.props.hideFields.includes('encryptionVersion') ? null : (
          <td style={{ whiteSpace: 'nowrap' }}>{encryptionVersion}</td>
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
  metadataCaptureTime: PropTypes.instanceOf(Date).isRequired,
  latestPurchaseTime: PropTypes.instanceOf(Date),
  noOfAccessed: PropTypes.number,
  encryptionVersion: PropTypes.string,
};

FileListItem.defaultProps = {
  hideFields: [],
  noOfAccessed: 0,
};

export default FileListItem;
