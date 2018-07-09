/*jshint esversion: 6*/

// run with local Provider
import Web3 from 'web3';
//overrides metamask v0.2 for our v 1.0
// const lib_web3 = new Web3(window.web3.currentProvider);
const lib_web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:8546");

export default lib_web3;