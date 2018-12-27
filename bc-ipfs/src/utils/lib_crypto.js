/* jshint esversion: 6 */

var EncryptionVersion = {
    CryptoJs: "crypto-js"
};

const crypto_js = require('crypto-js');

module.exports = {
    crypto_js: crypto_js,
    EncryptionVersion: EncryptionVersion,
};