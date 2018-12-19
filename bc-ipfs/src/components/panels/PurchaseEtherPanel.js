import React, { Component } from 'react';
import { Alert, Panel, Image, FormGroup, ControlLabel, HelpBlock, FormControl, Tooltip, OverlayTrigger } from 'react-bootstrap';
import lib_web3 from '../../utils/lib_web3';
import lib_trading_contract from '../../utils/lib_trading_contract';
var PropTypes = require('prop-types');

class PurchaseEthPanel extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      has_wallet: false,
      has_account: false,
      account_addr: '',
      account_balance: undefined,
      bmd_token_amount: 0,
      show: false,
      coinbase_code: '9ec56d01-7e81-5017-930c-513daa27bb6a',
      exchange_rate: undefined,
    };

    this.captureFileAndMetadata = this.captureFileAndMetadata.bind(this);
    this.fetchExchangeRate = this.fetchExchangeRate.bind(this);
    this.getEthTokens = this.getEthTokens.bind(this);
    this.toggle = this.toggle.bind(this);    
    this.exchange_rate_tooltip = this.exchange_rate_tooltip.bind(this);
  }

  exchange_rate_tooltip() {
    return (
      <Tooltip id="tooltip">
        The exchange rate of BlockMed(BMD) renews once a day.
      </Tooltip>
    );
  }

  getEthTokens() {
    console.log(typeof this.state.bmd_token_amount);
    if ((typeof this.state.exchange_rate !== 'undefined') && !isNaN(this.state.bmd_token_amount)) {
      return this.state.bmd_token_amount / this.state.exchange_rate;
    }
    return 0;
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

  componentDidMount() {
    let has_wallet = false;
    let has_account = false;
    this.fetchExchangeRate();
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
            .then(balance => {
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
            <FormGroup controlId="formBlockMedToken" validationState={isNaN(this.state.bmd_token_amount)? 'warning' : 'success'}>
              <ControlLabel>How many BlockMed tokens do you what to have?</ControlLabel>
              <FormControl type="text" name="bmd_token_amount" onChange={this.captureFileAndMetadata} />
              <HelpBlock style={{ display: typeof this.state.exchange_rate != 'undefined' ? 'block' : 'none' }}>
                You need <strong>{this.getEthTokens()}</strong> Ethereum tokens to exchange for BlockMed(BMD) tokens.{' '}
                <OverlayTrigger placement="right" overlay={this.exchange_rate_tooltip()}>
                  <Image src="info.png" height="15px" width="15px" />
                </OverlayTrigger>
              </HelpBlock>
              <HelpBlock style={{ display: (this.state.account_addr != '') ? 'block' : 'none' }}>
                Click{' '}<strong>
                <a
                  href={`https://buy.coinbase.com/widget?address=${this.state.account_addr}&amount=${
                    this.state.bmd_token_amount
                  }&code=${this.state.coinbase_code}&crypto_currency=ETH`}
                  target="_blank"
                >
                  here
                </a>{' '}</strong>
                to Coinbase to purchase Ethereum.
              </HelpBlock>
            </FormGroup>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}

PurchaseEthPanel.propTypes = {
  title: PropTypes.string,
};

PurchaseEthPanel.defaultProps = {
  title: 'Purchase Ethereum',
};

export default PurchaseEthPanel;
