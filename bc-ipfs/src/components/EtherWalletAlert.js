import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import lib_web3 from '../utils/lib_web3';
var PropTypes = require('prop-types');
// Deprecated
class EtherWalletAlert extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      wallet_alert_show: false,
    };
  }

  componentDidMount() {
    let wallet_alert_show = false;
    lib_web3.eth.getAccounts(function(err, accounts) {
      if (err) {
        wallet_alert_show = true;
        console.error(err);
      } else {
        console.log('All available accounts: ' + accounts);
        if(accounts.length == 0 ) {
          wallet_alert_show = true;
        }
        // submit_acct = accounts[0];
      }
    }).catch( (err) => {

    }).then( () => {
      this.setState({ ['wallet_alert_show']: wallet_alert_show });
    });
  }

  render() {
    return (
      // <Alert bsStyle="danger" style={{ display: this.state.wallet_alert_show ? 'block' : 'none' }}>
      //   <h3>Unable to connect with your Ethereum wallet account.</h3>
      //   <h4>Please make sure you have Ethereum wallet installed, loginned and have valid account.</h4>
      //   <p>
      //     For desktop user, please see instruction <a href='https://github.com/BlockMedical/BlockMedical/blob/master/docs/metamaskdocs/metamask_exchange_instructions.md'>here</a>.
      //   </p>
      //   <p>For iOS user, please see instruction <a href='https://github.com/BlockMedical/BlockMedical/blob/master/docs/mobiledocs/README.md'>here</a></p>
      //   <p>
      //     For Android user, you can install Firefox from{' '}
      //     <a href="https://play.google.com/store/apps/details?id=org.mozilla.firefox">Google Play Store</a> and install{' '}
      //     <a href="https://addons.mozilla.org/zh-TW/android/addon/ether-metamask/">MetaMask plugin</a>. For more MetaMask usage, please see instruction <a href='https://github.com/BlockMedical/BlockMedical/blob/master/docs/metamaskdocs/metamask_exchange_instructions.md'>here</a>.
      //   </p>
      // </Alert>
      <Alert bsStyle="danger" style={{ display: this.state.wallet_alert_show ? 'block' : 'none' }}>
        <strong>We have detected either you don’t have a wallet or your wallet is not unlocked. Click <a href='https://github.com/BlockMedical/BlockMedical/blob/master/docs/README.md'>here</a> to get a wallet.</strong>
      </Alert>
    );
  }
}

EtherWalletAlert.propTypes = {
  show: PropTypes.bool,
};

EtherWalletAlert.defaultProps = {
  show: false,
};

export default EtherWalletAlert;
