#!/bin/bash -x

CURR_DIR=$(cd $(dirname $0); pwd)

GO_VER=${GO_VER:-"11"}

docker run --rm -it \
  --publish 127.0.0.1:3000:3000 \
  --publish 127.0.0.1:5001:5001 \
  --publish 127.0.0.1:8888:8080 \
  --mount type=bind,source=$CURR_DIR/bc-ipfs,target=/home/ipfsuser/bc-ipfs \
  blcksync/bc-geth-ipfs-dev-${GO_VER} \
  bash -l
