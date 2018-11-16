#!/bin/bash

CURR_DIR=$(cd $(dirname $0); pwd)

BUILD_BRANCH=${BUILD_BRANCH:-"encryption-v0.2"}

mkdir $CURR_DIR/data
chmod -R 777 $CURR_DIR/data

docker run --rm -it \
  --publish 3000:3000 \
  --publish 5001:5001 \
  --publish 8888:8080 \
  --env IPFS_PATH=/data/ipfs \
  --mount type=bind,source=$CURR_DIR/ipfs,target=/data/bc-ipfs \
  bc-ipfs-${BUILD_BRANCH} \
  bash -l
