import React, { Component } from 'react';
var PropTypes = require('prop-types');

const sufixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const getBytes = bytes => {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (!bytes && '0 Bytes') || (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sufixes[i];
};

/*jshint ignore:start*/
const Bytes = ({ bytes }) => <span>{getBytes(bytes)}</span>;
/*jshint ignore:end*/

Bytes.propTypes = {
  bytes: PropTypes.number,
};

export default Bytes;