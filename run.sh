#!/bin/bash

BUILD_BRANCH=${BUILD_BRANCH:-"master"}

docker run --rm -it \
  --publish 127.0.0.1:3000:3000 \
  blcksync/bc-ipfs:${BUILD_BRANCH}
