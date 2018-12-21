/* jshint esversion: 6 */
import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import browser from '../utils/lib_browser';
import isMobile from '../utils/lib_user_agent';

class BrowserAlert extends Component {
  constructor(props, context) {
    super(props, context);

    this.isShow = this.isShow.bind(this);
  }

  isShow() {
    console.log(`isMobile:${isMobile.any()} isChrome:${browser.isChrome()} isFirefox:${browser.isFirefox()}`);
    if (isMobile.any() || browser.isChrome() || browser.isFirefox()) return false;
    else return true;
  }

  /* jshint ignore:start */
  render() {
    return (
      <Alert bsStyle="danger" style={{ display: this.isShow() ? 'block' : 'none' }}>
        <strong>Please use Chrome. Other Browsers are not supported at the moment.</strong>
      </Alert>
    );
  }
  /* jshint ignore:end */
}

export default BrowserAlert;
