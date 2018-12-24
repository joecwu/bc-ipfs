import React, { Component } from 'react';
import { Alert, Panel, Image, Button } from 'react-bootstrap';
import lib_web3 from '../../utils/lib_web3';
var PropTypes = require('prop-types');

class EtherWalletInstructionPanel extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      has_wallet: false,
      has_account: false,
      show: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    let has_wallet = false;
    let has_account = false;
    lib_web3.eth
      .getAccounts(function(err, accounts) {
        if (err) {
          console.error(err);
        } else {
          has_wallet = true;
          console.log('All available accounts: ' + accounts);
          if (accounts.length > 0) {
            has_account = true;
          }
          // submit_acct = accounts[0];
        }
      })
      .catch(err => {
        has_wallet = false;
        console.error(err);
      })
      .then(() => {
        this.setState({
          ['has_wallet']: has_wallet,
          ['has_account']: has_account,
          ['show']: !(has_account && has_wallet),
        });
      });
  }

  toggle() {
    this.setState({ ['show']: !this.state.show });
  }

  render() {
    /* jshint ignore:start */
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
      <Panel bsStyle="primary" expanded={this.state.show} onToggle={this.toggle}>
        <Panel.Heading>
          <Panel.Title toggle componentClass="h3">
            {this.props.title}
          </Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <Alert bsStyle="danger" style={{ display: !this.state.has_wallet ? 'block' : 'none' }}>
              <strong>We have detected you don’t have a wallet. </strong>
            </Alert>
            <Alert
              bsStyle="danger"
              style={{ display: this.state.has_wallet && !this.state.has_account ? 'block' : 'none' }}
            >
              <strong>
                Please enter password to unlock <abbr title="An Ethereum wallet for Chrome Browser">Metamask</abbr>{' '}
                <Image src="metamask.png" height="30px" width="30px" /> ↗ on your top right.
              </strong>
            </Alert>
            <p>
              Click{' '}
              <Button
                bsStyle="info"
                href="https://github.com/BlockMedical/BlockMedical/blob/master/docs/README.md"
                target="_blank"
              >
                here
              </Button>{' '}
              to get a wallet instruction.
            </p>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
    /* jshint ignore:end */
  }
}

EtherWalletInstructionPanel.propTypes = {
  title: PropTypes.string,
};

EtherWalletInstructionPanel.defaultProps = {
  title: 'Ethereum Wallet Instruction',
};

export default EtherWalletInstructionPanel;
