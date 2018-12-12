import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import lib_web3 from '../utils/lib_web3';
var PropTypes = require('prop-types');

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
      <Alert bsStyle="danger" style={{ display: this.state.wallet_alert_show ? 'block' : 'none' }}>
        <h3>Warning!</h3>
        <p>Unable to connect with your Ethereum wallet account.</p>
        <p>Please make sure you have Ethereum wallet plugin installed, loginned and have valid account.</p>
        <p>
          For desktop user, you can install <a href="https://metamask.io/">MetaMask</a> Chrome or Firefox plugin.
        </p>
        <p>For iOS user, please use our native app from App Store. (link TBD)</p>
        <p>
          For Android user, you can install Firefox from{' '}
          <a href="https://play.google.com/store/apps/details?id=org.mozilla.firefox">Google Play Store</a> and install{' '}
          <a href="https://addons.mozilla.org/zh-TW/android/addon/ether-metamask/">MetaMask plugin</a>.
        </p>
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
