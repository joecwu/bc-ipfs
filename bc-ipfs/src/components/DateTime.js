import React, { Component } from 'react';
var PropTypes = require('prop-types');

/*jshint ignore:start*/
const DateTime = ({ value }) => <span>{(typeof value === 'undefined') ? '' : value.toLocaleString()}</span>;
/*jshint ignore:end*/

DateTime.propTypes = {
  value: PropTypes.instanceOf(Date)
};

export default DateTime;