import React, { Component } from 'react';
import 'whatwg-fetch';
import { Button, Form, FormGroup, ControlLabel, FormControl, Table } from 'react-bootstrap';
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
        //   purchaseCount: 0
        // }
      ],
      keyword: props.keyword,
    };
    this.fetchItemsFromServer = this.fetchItemsFromServer.bind(this);
    this.search = this.search.bind(this);
    this.keywordChange = this.keywordChange.bind(this);
  }

  fetchItemsFromServer() {
    var targetSearchTemplate = 'blockmed-trans-aggs-all';
    if (this.state.keyword != '') {
      targetSearchTemplate = 'blockmed-trans-aggs';
    }

    window
      .fetch('http://es.blcksync.info/blockmed-trans-*/_search/template', {
        method: 'POST',
        headers: {
          Authorization: 'Basic YWRtaW46YWRtaW4=',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: targetSearchTemplate,
          params: {
            query_string: this.state.keyword,
            size: 1000, //[WORKAROUND] due to ES aggregation precision issue, we have to fetch large size data to make aggs more accurate
          },
        }),
      })
      .then(response => response.json())
      .then(esResponse => this.convertToItems(esResponse));
  }

  componentDidMount() {
    console.log('componentDidMount');
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
    esResponse.aggregations.ipfsMetadataHash.buckets.slice(pageIndex, pageSize).map(hashBucket => {
      var hitItem = hashBucket.top_hits.hits.hits[0];
      items.push({
        _id: hitItem._id,
        hashId: hashBucket.key,
        description: hitItem._source.metadata.description,
        fileSize: hashBucket.filesize.value,
        tokenCost: hitItem._source.returnValues.tokenCost,
        purchaseCount: hashBucket.PurchaseTxRecordCount.doc_count,
      });
    });
    this.setState({ items });
  }

  render() {
    const { pageIndex, pageSize, sortedBy, keyword } = this.props;
    const { items } = this.state;
    const rows = items.map(item => (
      /*jshint ignore:start*/
      <FileListItem
        key={item._id}
        hashId={item.hashId}
        description={item.description}
        fileSize={item.fileSize}
        tokenCost={item.tokenCost}
        purchaseCount={item.purchaseCount}
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
          </FormGroup>{' '}
          <Button type="submit" onClick={this.search}>
            Search
          </Button>
        </Form>
        <Table responsive striped bordered condensed hover>
          <thead>
            <tr>
              <th />
              <th>Description</th>
              <th>File Size</th>
              <th>BMD Token Cost</th>
              <th>No. of Accessed</th>
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
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  sortedBy: PropTypes.string,
  keyword: PropTypes.string,
};

FileList.defaultProps = {
  pageIndex: 0,
  pageSize: 5,
  sortedBy: 'filesize',
  keyword: '',
};
export default FileList;
