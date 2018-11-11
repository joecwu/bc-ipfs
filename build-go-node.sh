#!/bin/bash

# Default we use latest go-lang version
GO_VER=${GO_VER:-"11"}

# alpine-node is shared which includes npm. It should be agnostic
# to go-lang version.

if [ "$GO_VER" = "10" ] ; then
  echo "ok - building Go 1.10.x"
  docker build \
    --rm \
    -t go${GO_VER}-node \
    --build-arg ALPINE_IMAGE="alpine-node:latest" \
    --file Dockerfile.go${GO_VER}-node \
    .
elif [ "$GO_VER" = "11" ] ; then
  echo "ok - building Go 1.11.x"
  docker build \
    --rm \
    -t go${GO_VER}-node \
    --build-arg ALPINE_IMAGE="alpine-node:latest" \
    --file Dockerfile.go${GO_VER}-node \
    .

fi
