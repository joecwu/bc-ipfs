/*jshint esversion: 6*/

// run with local Provider
import lib_web3 from './lib_web3';

const address = CONFIG.ethereum.trading_contract.address;
const abi = [
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'exchangeRate',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'exchanger',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'ownerKill',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'owner',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_new_erc20_addr',
        type: 'address',
      },
    ],
    name: 'updateTokenContract',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'currentTokenContract',
    outputs: [
      {
        name: 'tok_addr',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_exchanger',
        type: 'address',
      },
    ],
    name: 'delegateExchangerAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'a',
        type: 'uint256',
      },
      {
        name: 'b',
        type: 'uint256',
      },
    ],
    name: 'safeSub',
    outputs: [
      {
        name: 'c',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: '_target_wallet',
        type: 'address',
      },
    ],
    name: 'updateWithdrawAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'a',
        type: 'uint256',
      },
      {
        name: 'b',
        type: 'uint256',
      },
    ],
    name: 'safeDiv',
    outputs: [
      {
        name: 'c',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'exchanging_token_addr',
    outputs: [
      {
        name: '',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'takerBuyAsset',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'flipTokenEx',
        type: 'bool',
      },
    ],
    name: 'activate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'a',
        type: 'uint256',
      },
      {
        name: 'b',
        type: 'uint256',
      },
    ],
    name: 'safeMul',
    outputs: [
      {
        name: 'c',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      {
        name: 'newExRate',
        type: 'uint256',
      },
    ],
    name: 'setExchangeRate',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'allowIpfsReg',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'allowTokenEx',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      {
        name: 'a',
        type: 'uint256',
      },
      {
        name: 'b',
        type: 'uint256',
      },
    ],
    name: 'safeAdd',
    outputs: [
      {
        name: 'c',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        name: '_ex_tok_addr',
        type: 'address',
      },
      {
        name: '_target_wallet',
        type: 'address',
      },
      {
        name: 'enableTokenEx',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    payable: true,
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: false,
        name: 'ethersSent',
        type: 'uint256',
      },
      {
        indexed: false,
        name: 'tokensBought',
        type: 'uint256',
      },
    ],
    name: 'ExchangeTokens',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'msg',
        type: 'string',
      },
      {
        indexed: false,
        name: 'allowTokenEx',
        type: 'bool',
      },
    ],
    name: 'AllowExchange',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'msg',
        type: 'string',
      },
      {
        indexed: false,
        name: 'newExchangeRate',
        type: 'uint256',
      },
    ],
    name: 'NewExchangeRate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'caller',
        type: 'address',
      },
      {
        indexed: false,
        name: 'target_wallet',
        type: 'address',
      },
      {
        indexed: false,
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdrawal',
    type: 'event',
  },
];
const lib_trading_contract = new lib_web3.eth.Contract(abi, address, {
  gasPrice: CONFIG.ethereum.trading_contract.gasPrice,
  gas: CONFIG.ethereum.trading_contract.gas,
});

export default lib_trading_contract;
