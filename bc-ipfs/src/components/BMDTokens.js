import React, { Component } from 'react';
import {BigNumber} from 'bignumber.js';
var PropTypes = require('prop-types');

const getTokens = value => {
  var decimals = 18;
  /* jshint ignore:start */
  var eth_to_wei = new BigNumber(10 ** decimals);
  /* jshint ignore:end */
  let token_cost = new BigNumber(value).div(eth_to_wei).toNumber();
  return token_cost;
};

/*jshint ignore:start*/
const BMDTokens = ({ value }) => <span>{getTokens(value)}</span>;
/*jshint ignore:end*/

BMDTokens.propTypes = {
  value: PropTypes.string.isRequired,
};

export default BMDTokens;
