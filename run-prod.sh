#!/bin/bash

CURR_DIR=$(cd $(dirname $0); pwd)

BUILD_BRANCH=${BUILD_BRANCH:-"master"}

IPFS_DIR="$CURR_DIR/data"
mkdir -p $IPFS_DIR
chmod -R 777 $IPFS_DIR

docker run --rm -it \
  --publish 3000:3000 \
  --publish 5001:5001 \
  --publish 8888:8080 \
  --env IPFS_PATH=/data/ipfs \
  --mount type=bind,source=$IPFS_DIR,target=/home/ipfsuser/ipfs \
  bc-ipfs-${BUILD_BRANCH} \
  bash -l
