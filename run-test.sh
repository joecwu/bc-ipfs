#!/bin/bash -x

CURR_DIR=$(cd $(dirname $0); pwd)

BUILD_BRANCH=${BUILD_BRANCH:-"master"}

IPFS_DIR="$CURR_DIR/data"
mkdir -p $IPFS_DIR
chmod -R 777 $IPFS_DIR

docker run --rm -it \
  --publish 3000:3000 \
  blcksync/bc-ipfs:${BUILD_BRANCH} \
  npm test
