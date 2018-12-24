import React, { Component } from 'react';
import {
  Alert,
  Button,
  Panel,
  Image,
  FormGroup,
  ControlLabel,
  HelpBlock,
  FormControl,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';
import lib_web3 from '../../utils/lib_web3';
import { div18decimals } from '../../utils/lib_token';
import lib_trading_contract from '../../utils/lib_trading_contract';
var PropTypes = require('prop-types');

class PurchaseEtherPanel extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      has_wallet: false,
      has_account: false,
      account_addr: '',
      account_balance: undefined,
      eth_wei_balance: 0, // same as account_balance, but in unit wei
      usd_amount: 0,
      show: false,
      coinbase_code: '9ec56d01-7e81-5017-930c-513daa27bb6a',
    };

    this.captureFileAndMetadata = this.captureFileAndMetadata.bind(this);
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
            return accounts[0];
          } else return '';
        }
      })
      .then(account_addr => {
        this.setState({ ['account_addr']: account_addr });
      })
      .catch(err => {
        has_wallet = false;
        console.error(err);
      })
      .then(() => {
        this.setState({
          ['has_wallet']: has_wallet,
          ['has_account']: has_account,
        });
        if (this.state.account_addr != '') {
          console.info(`getting account balance address:[${this.state.account_addr}]`);
          lib_web3.eth
            .getBalance(this.state.account_addr.toString())
            .then(rawBalance => {
              console.debug(`got balance. account:[${this.state.account_addr}] rawBalance:[${rawBalance}]`);
              const balance = div18decimals(rawBalance);
              //TODO balance should divid 10^18
              this.setState({ ['account_balance']: balance, ['show']: balance < 1, ['eth_wei_balance']: rawBalance });
            })
            .catch(err => {
              this.setState({ ['show']: has_account && has_wallet });
              console.error(err);
            });
        } else {
          this.setState({ ['show']: has_account && has_wallet });
        }
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
      console.debug('Capturing input from ' + name + ' with value = ' + target.value);
      this.setState({
        [name]: target.value,
      });
      return;
    } else {
      console.error('Detect unknown type=' + type + ' with name=' + name);
      return;
    }
  }

  toggle() {
    this.setState({ ['show']: !this.state.show });
  }

  /*jshint ignore:start*/
  render() {
    return (
      <Panel bsStyle="primary" expanded={this.state.show} onToggle={this.toggle}>
        <Panel.Heading>
          <Panel.Title toggle componentClass="h3">
            {this.props.title}
          </Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <Alert
              bsStyle="danger"
              style={{ display: !this.state.has_wallet || !this.state.has_account ? 'block' : 'none' }}
            >
              <strong>
                Please enter password to unlock <abbr title="An Ethereum wallet for Chrome Browser">Metamask</abbr>{' '}
                <Image src="metamask.png" height="30px" width="30px" /> on your top right ↗. Don't have Metamask, see{' '}
                <a href="https://github.com/BlockMedical/BlockMedical/blob/master/docs/README.md">here</a>.{' '}
              </strong>
            </Alert>
            <Alert
              bsStyle="danger"
              style={{
                display:
                  typeof this.state.account_balance !== 'undefined' &&
                  this.state.eth_wei_balance < CONFIG.ethereum.minimal_fund
                    ? 'block'
                    : 'none',
              }}
            >
              Insufficient Ethereum to pay gas! Please fund your wallet with more Ethereum (ETH)!
            </Alert>

            <FormGroup controlId="formWalletInfo" style={{ display: this.state.account_addr != '' ? 'block' : 'none' }}>
              <ControlLabel>Your Ethereum Wallet Info:</ControlLabel>
              <p>
                Address: <strong>{this.state.account_addr}</strong>
              </p>
              <p>
                Balance: <strong>{this.state.account_balance}</strong> ETH
              </p>
            </FormGroup>
            <FormGroup
              controlId="formBlockMedToken"
              validationState={isNaN(this.state.usd_amount) ? 'error' : 'success'}
            >
              <ControlLabel>How many USD do you what to exchange for Ethereum(ETH)?</ControlLabel>
              <FormControl type="text" name="usd_amount" onChange={this.captureFileAndMetadata} />
              <br />
              <Button
                bsStyle="primary"
                disabled={this.state.account_addr == ''}
                href={`https://buy.coinbase.com/widget?address=${this.state.account_addr}&amount=${
                  this.state.usd_amount
                }&code=${this.state.coinbase_code}&crypto_currency=ETH`}
                target="_blank"
              >
                Purchase
              </Button>
            </FormGroup>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
  /*jshint ignore:end*/
}

PurchaseEtherPanel.propTypes = {
  title: PropTypes.string,
};

PurchaseEtherPanel.defaultProps = {
  title: 'Fund Your Wallet',
};

export default PurchaseEtherPanel;
