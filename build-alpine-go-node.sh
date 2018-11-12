#!/bin/bash

GO_VER=${GO_VER:-"11"}
IMG_LABEL_TAG="blcksync/alpine-node"

echo "ok - building our own customized image "
# Build base blcksync/alpine-node:latest image
docker build \
  --rm \
  -t $IMG_LABEL_TAG \
  --file Dockerfile.alpine-node \
  .

GO_VER=$GO_VER ./build-go-node.sh
