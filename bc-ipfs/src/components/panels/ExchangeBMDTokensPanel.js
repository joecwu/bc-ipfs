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
import { div18decimals, mul18decimals } from '../../utils/lib_token';
import lib_trading_contract from '../../utils/lib_trading_contract';
import lib_token_contract from '../../utils/lib_token_contract';
import lib from 'react-confirm-alert';
import { isNullOrUndefined } from 'util';
var PropTypes = require('prop-types');

class ExchangeBMDTokensPanel extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      has_wallet: false,
      has_account: false,
      account_addr: '',
      account_balance: undefined,
      bmd_balance: undefined,
      bmd_token_amount: 0,
      show: false,
      exchange_rate: undefined,
    };

    this.captureFileAndMetadata = this.captureFileAndMetadata.bind(this);
    this.fetchAccountInfo = this.fetchAccountInfo.bind(this);
    this.fetchExchangeRate = this.fetchExchangeRate.bind(this);
    this.getEthTokens = this.getEthTokens.bind(this);
    this.toggle = this.toggle.bind(this);
    this.exchangeRateTooltip = this.exchangeRateTooltip.bind(this);
    this.getRemainingBMD = this.getRemainingBMD.bind(this);
    this.performTokenExchange = this.performTokenExchange.bind(this);
  }

  exchangeRateTooltip() {
    return <Tooltip id="tooltip">The exchange rate of BlockMed(BMD) renews once a day.</Tooltip>;
  }

  getEthTokens() {
    if (typeof this.state.exchange_rate !== 'undefined' && !isNaN(this.state.bmd_token_amount)) {
      return this.state.bmd_token_amount / this.state.exchange_rate;
    }
    return 0;
  }

  getRemainingBMD() {
    var balance;
    console.log(`getRemainingBMD account:[${this.state.account_addr}]`);
    lib_token_contract.methods
      .balanceOf(
        this.state.account_addr
      ).call()
      .then((rawBalance) => {
        balance = div18decimals(rawBalance);
        console.log(balance);
      })
      .catch(err => {
        console.error(err);
      })
      .then(() => {
        this.setState({['bmd_balance']: balance})
      });
  }

  performTokenExchange() {
    const accountAddr = this.state.account_addr;
    const ethAmount = this.getEthTokens();
    console.log(`exchanging BMD:[${this.state.bmd_token_amount}] eth:[${ethAmount}] account:[${accountAddr}]`);
    lib_trading_contract.methods
      .takerBuyAsset()
      .send({
        from: accountAddr,
        value: mul18decimals(ethAmount),
      })
      .then(resp => {
        console.log('performTokenExchange success.')
      })
      .catch(err => {
        console.error(err);
      });
  }

  fetchExchangeRate() {
    console.log('fetching exchange rate');
    lib_trading_contract.methods
      .exchangeRate()
      .call()
      .then(rate => {
        console.log(`fetched exchange rate:[${rate}]`);
        this.setState({ ['exchange_rate']: rate });
      })
      .catch(err => {
        console.error(err);
      });
  }

  fetchAccountInfo() {
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
        this.setState({ ['account_addr']: account_addr.toString() });
        this.getRemainingBMD();
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
            .getBalance(this.state.account_addr)
            .then(rawBalance => {
              const balance = div18decimals(rawBalance);
              console.debug(`got balance. account:[${this.state.account_addr}] balance:[${balance}]`);
              //TODO balance should divid 10^18
              this.setState({ ['account_balance']: balance, ['show']: balance < 1 });
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

  componentDidMount() {
    let has_wallet = false;
    let has_account = false;
    this.fetchExchangeRate();
    this.fetchAccountInfo();
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
                Please enter password to unlock Metamask on your top right. Don't have Metamask, see{' '}
                <a href="https://github.com/BlockMedical/BlockMedical/blob/master/docs/README.md">here</a>.{' '}
              </strong>
            </Alert>
            <FormGroup controlId="formWalletInfo" style={{ display: this.state.account_addr != '' ? 'block' : 'none' }}>
              <ControlLabel>Your Wallet Info:</ControlLabel>
              <p>
                Address: <strong>{this.state.account_addr}</strong>
              </p>
              <p>
                Balance: <strong>{this.state.account_balance}</strong> ETH
              </p>
              <p>
                Tokens: <strong>{this.state.bmd_balance}</strong> BMD
              </p>
            </FormGroup>
            <FormGroup
              controlId="formBlockMedToken"
              validationState={isNaN(this.state.bmd_token_amount) ? 'error' : 'success'}
            >
              <ControlLabel>How many BlockMed(BMD) tokens do you what to have?</ControlLabel>
              <FormControl type="text" name="bmd_token_amount" onChange={this.captureFileAndMetadata} />
              <HelpBlock style={{ display: typeof this.state.exchange_rate != 'undefined' ? 'block' : 'none' }}>
                You need <strong>{this.getEthTokens()}</strong> Ethereum tokens to exchange for BlockMed(BMD) tokens.{' '}
                <OverlayTrigger placement="right" overlay={this.exchangeRateTooltip()}>
                  <Image src="info.png" height="15px" width="15px" />
                </OverlayTrigger>
                <br />
                BMD ERC20 Public Sale Address: <strong>{CONFIG.ethereum.trading_contract.address}</strong>
              </HelpBlock>
              <Alert
                bsStyle="danger"
                style={{ display: (this.state.account_balance < this.getEthTokens() ) ? 'block' : 'none' }}
              >
                <strong>
                  Insufficient Ethereum(ETH), please fund your wallet with Ethereum first.
                </strong>
              </Alert>
              <Button
                bsStyle="primary"
                disabled={this.state.account_addr == '' || this.state.bmd_token_amount=='' || isNaN(this.state.bmd_token_amount)}
                onClick={this.performTokenExchange}
              >
                Exchange BMD Tokens
              </Button>
            </FormGroup>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}

ExchangeBMDTokensPanel.propTypes = {
  title: PropTypes.string,
};

ExchangeBMDTokensPanel.defaultProps = {
  title: 'Exchange BlockMed(BMD) Tokens',
};

export default ExchangeBMDTokensPanel;
