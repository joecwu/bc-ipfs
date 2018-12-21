/* jshint esversion: 6 */

// run with local Provider
import Web3 from 'web3';

let local_web3;

// overrides metamask v0.2 for our v1.0 or use a local geth instance
// Fix due to EIP-1102 (https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1102.md)
if (window.ethereum) {
  local_web3 = new Web3(ethereum);
  try {
    /* jshint ignore:start */
    async () => {
      await ethereum.enable();
    };
    /* jshint ignore:end */
  } catch (error) {
    console.log(error);
  }
} else {
  // backward compatibility
  local_web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(CONFIG.ethereum.websocket_provider));
}

const lib_web3 = local_web3;
export default lib_web3;
