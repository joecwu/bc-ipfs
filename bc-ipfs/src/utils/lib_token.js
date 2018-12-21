/* jshint esversion: 6 */
import { BigNumber } from 'bignumber.js';

export const div18decimals = value => {
  var decimals = 18;
  /* jshint ignore:start */
  var eth_to_wei = new BigNumber(10 ** decimals);
  /* jshint ignore:end */
  let token_cost = new BigNumber(value).div(eth_to_wei).toNumber();
  return token_cost;
};

export const mul18decimals = value => {
  var decimals = 18;
  /* jshint ignore:start */
  var eth_to_wei = new BigNumber(10 ** decimals);
  /* jshint ignore:end */
  let wei = new BigNumber(value).multipliedBy(eth_to_wei).toNumber();
  return wei;
};

export const getBMDTokensByFilesize = value => {
  var decimals = 18;
  /* jshint ignore:start */
  var eth_to_wei = new BigNumber(10 ** decimals);
  /* jshint ignore:end */
  // TODO: This 200 will change in the future, extract into a parameter in CONFIG
  var filesize_to_token_ex = 200 * 1024 * 1024 * 1024; // 1token = 200GB

  let expect_reward = new BigNumber(value)
    .multipliedBy(eth_to_wei)
    .dividedBy(filesize_to_token_ex)
    .integerValue(BigNumber.ROUND_FLOOR);
  return expect_reward.div(eth_to_wei).toNumber();
};

module.exports = {
  div18decimals: div18decimals,
  mul18decimals: mul18decimals,
  getBMDTokensByFilesize: getBMDTokensByFilesize,
};
