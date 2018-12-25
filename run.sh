#!/bin/bash

BUILD_BRANCH=${BUILD_BRANCH:-"master"}

docker run --rm -it \
  --publish 127.0.0.1:3000:3000 \
  --publish 127.0.0.1:5001:5001 \
  --publish 127.0.0.1:8080:8080 \
  blcksync/bc-ipfs-${BUILD_BRANCH}
