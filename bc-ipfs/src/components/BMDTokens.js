import React, { Component } from 'react';
import { BigNumber } from 'bignumber.js';
import { div18decimals } from '../utils/lib_token';
var PropTypes = require('prop-types');

/*jshint ignore:start*/
const BMDTokens = ({ value }) => <span>{div18decimals(value)}</span>;
/*jshint ignore:end*/

BMDTokens.propTypes = {
  value: PropTypes.string.isRequired,
};

export default BMDTokens;
