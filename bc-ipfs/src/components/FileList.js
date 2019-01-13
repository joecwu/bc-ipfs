import React, { Component } from 'react';
import 'whatwg-fetch';
import { Button, Form, FormGroup, Image, FormControl, Table, Pager } from 'react-bootstrap';
import FileListItem from './FileListItem';

var PropTypes = require('prop-types');

class FileList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      items: [
        // {
        //   _id: '001',
        //   hashId: 'hashId',
        //   description: 'Item 1',
        //   fileSize: 123,
        //   tokenCost: "100",
        //   noOfAccessed: 0
        // }
      ],
      keyword: props.keyword,
      category: props.category,
      pageIndex: props.pageIndex,
      pageSize: props.pageSize,
      sortedBy: props.sortedBy,
      sortedByAssending: false,
      is_loading: false,
    };
    this.fetchItemsFromServer = this.fetchItemsFromServer.bind(this);
    this.search = this.search.bind(this);
    this.keywordChange = this.keywordChange.bind(this);
    this.sortByColumn = this.sortByColumn.bind(this);
    this.getSortedColumnCss = this.getSortedColumnCss.bind(this);
  }

  sortByColumn(e) {
    console.debug('sort by column', e.target);
    var sortedByAssending = this.state.sortedByAssending;
    if(e.target.id == this.state.sortedBy) {
      sortedByAssending = !sortedByAssending;
    } else {
      // default is desc
      sortedByAssending = false;
    }
    this.setState({ ['sortedBy']: e.target.id, ['sortedByAssending']: sortedByAssending }, () => {
      this.fetchItemsFromServer();
    });
  }

  getSortedColumnCss(target) {
    var css = 'sortable';
    if(this.state.sortedBy != target) {
      css = 'sortable';
    } else {
      if(this.state.sortedByAssending) {
        css = 'sortable asc';
      } else {
        css = 'sortable desc';
      }
    }
    return css;
  }

  fetchItemsFromServer() {
    console.log('fetchItemsFromServer');
    this.setState({ ['is_loading']: true });
    var targetSearchTemplate = 'blockmed-ipfs';
    var search_req_body = JSON.stringify({
      id: targetSearchTemplate,
      params: {
        query_string: this.state.keyword,
        category: this.state.category,
        size: this.state.pageSize,
        from: this.state.pageIndex * this.state.pageSize,
        sort_by_time: this.state.sortedBy == 'time' ? 'true' : '',
        sort_by_filesize: this.state.sortedBy == 'filesize' ? 'true' : '',
        sort_by_accessed: this.state.sortedBy == 'accessed' ? 'true' : '',
        sort_order: this.state.sortedByAssending ? 'asc' : 'desc',
      },
    });
    console.log('fetch es', search_req_body);
    window
      .fetch(CONFIG.es.search_url.blockmed_ipfs, {
        method: 'POST',
        headers: {
          Authorization: CONFIG.es.authorization,
          'Content-Type': 'application/json',
        },
        body: search_req_body,
      })
      .then(response => response.json())
      .then(esResponse => this.convertToItems(esResponse))
      .catch(error => console.error(error))
      .then(() => this.setState({ ['is_loading']: false }));
  }

  componentDidMount() {
    this.fetchItemsFromServer();
  }

  search(event) {
    console.log('search for keyword:' + this.state.keyword);
    event.preventDefault();
    this.fetchItemsFromServer();
  }

  keywordChange(event) {
    event.preventDefault();
    this.setState({ keyword: event.target.value });
  }

  convertToItems(esResponse) {
    const { pageIndex, pageSize, sortedBy, keyword } = this.props;
    var items = [];
    esResponse.hits.hits.map(hitItem => {
      items.push({
        _id: hitItem._id,
        hashId: hitItem._id,
        description: hitItem._source.metadata.description,
        category: hitItem._source.metadata.category,
        fileSize: hitItem._source.metadata.filesize,
        tokenCost: hitItem._source.tokenCost,
        metadataCaptureTime: new Date(hitItem._source.metadataCaptureTime),
        /*jshint ignore:start*/
        latestPurchaseTime:
          typeof hitItem._source.latestPurchaseTime === 'undefined'
            ? undefined
            : new Date(hitItem._source.latestPurchaseTime),
        /*jshint ignore:end*/
        noOfAccessed: hitItem._source.purchaseTxRecords.length,
        encryptionVersion: hitItem._source.metadata.encryptionVersion
      });
    });
    console.debug('search result items.', items);
    this.setState({ items });
  }

  render() {
    const { pageIndex, pageSize, sortedBy, keyword } = this.props;
    const { items } = this.state;
    const rows = items.map(item => (
      /*jshint ignore:start*/
      <FileListItem
        hideFields={this.props.hideFields}
        key={item._id}
        hashId={item.hashId}
        description={item.description}
        category={item.category}
        fileSize={item.fileSize}
        tokenCost={item.tokenCost}
        metadataCaptureTime={item.metadataCaptureTime}
        latestPurchaseTime={item.latestPurchaseTime}
        noOfAccessed={item.noOfAccessed}
        encryptionVersion={item.encryptionVersion}
      />
      /*jshint ignore:end*/
    ));
    /*jshint ignore:start*/
    return (
      <div>
        <Form inline>
          <FormGroup controlId="formInlineSearch">
            <FormControl
              type="text"
              placeholder="keyword to search"
              value={this.state.keyword}
              onChange={this.keywordChange}
            />
            <Button type="submit" onClick={this.search}>
              Search
            </Button>
            <Image
              src="loading.gif"
              height="30px"
              width="30px"
              style={{ display: !this.state.is_loading ? 'none' : 'inline' }}
            />
          </FormGroup>
        </Form>
        <Table responsive striped bordered condensed hover className={'table-sortable'}>
          <thead>
            <tr>
              {this.props.hideFields.includes('accessFile') ? null : <th style={{ width: '85px' }} />}
              {this.props.hideFields.includes('description') ? null : <th>Description</th>}
              {this.props.hideFields.includes('category') ? null : <th style={{ width: '100px' }}>Category</th>}
              {this.props.hideFields.includes('metadataCaptureTime') ? null : (
                <th id='time' className={this.getSortedColumnCss('time')} style={{ width: '150px' }} onClick={this.sortByColumn}>Register Time</th>
              )}
              {this.props.hideFields.includes('fileSize') ? null : <th id='filesize' className={this.getSortedColumnCss('filesize')} style={{ width: '150px' }} onClick={this.sortByColumn}>File Size</th>}
              {this.props.hideFields.includes('tokenCost') ? null : <th style={{ width: '150px' }}>BMD Token Cost</th>}
              {this.props.hideFields.includes('noOfAccessed') ? null : (
                <th id='accessed' className={this.getSortedColumnCss('accessed')} style={{ width: '150px' }} onClick={this.sortByColumn}>No. of Accessed</th>
              )}
              {this.props.hideFields.includes('latestPurchaseTime') ? null : (
                <th style={{ width: '150px' }}>Last Access Time</th>
              )}
              {this.props.hideFields.includes('encryptionVersion') ? null : <th>Encryption Version</th>}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    );
    /*jshint ignore:end*/
  }
}

FileList.propTypes = {
  hideFields: PropTypes.arrayOf(PropTypes.string),
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  sortedBy: PropTypes.string,
  keyword: PropTypes.string,
  category: PropTypes.string,
};

FileList.defaultProps = {
  hideFields: [],
  pageIndex: 0,
  pageSize: 10,
  sortedBy: 'time',
  keyword: '',
  category: '',
};
export default FileList;
