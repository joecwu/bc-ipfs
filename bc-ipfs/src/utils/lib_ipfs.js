/* jshint esversion: 6 */
// Using the infura.io node, otherwise ipfs requires you to run a daemon on your own computer/server.
// See IPFS.io docs
// const IPFS = require('ipfs-api');
// const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

// run with local daemon
const ipfsApi = require('ipfs-http-client');
const lib_ipfs = new ipfsApi(CONFIG.ipfs.api.host, CONFIG.ipfs.api.port, { protocol: CONFIG.ipfs.api.protocol });

export default lib_ipfs;
