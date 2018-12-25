#!/bin/bash

# Default we use latest go-lang version
GO_VER=${GO_VER:-"11"}
ALPINE_IMAGE=${ALPINE_IMAGE:-"blcksync/alpine-node:latest"}

# alpine-node is shared which includes npm. It should be agnostic
# to go-lang version.

if [ "$GO_VER" = "10" ] ; then
  echo "ok - building Go 1.10.x"
  docker build \
    --rm \
    -t blcksync/go${GO_VER}-node \
    --build-arg ALPINE_IMAGE="$ALPINE_IMAGE" \
    --file Dockerfile.go${GO_VER}-node \
    .
elif [ "$GO_VER" = "11" ] ; then
  echo "ok - building Go 1.11.x"
  docker build \
    --rm \
    -t blcksync/go${GO_VER}-node \
    --build-arg ALPINE_IMAGE="$ALPINE_IMAGE" \
    --file Dockerfile.go${GO_VER}-node \
    .

fi
