#!/bin/bash -x

CURR_DIR=$(cd $(dirname $0); pwd)

docker run --rm -it \
  --publish 127.0.0.1:3000:3000 \
  --publish 127.0.0.1:5001:5001 \
  --publish 127.0.0.1:8080:8080 \
  --publish 127.0.0.1:8545:8545 \
  --publish 127.0.0.1:8546:8546 \
  --mount type=bind,source=$CURR_DIR/bc-ipfs,target=/home/ipfsuser/bc-ipfs \
  --mount type=bind,source=$HOME/Library/Ethereum/testnet,target=/home/ipfsuser/.ethereum/testnet \
  blcksync/bc-geth-ipfs-dev \
  bash -l
