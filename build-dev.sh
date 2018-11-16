#!/bin/bash -x

DEBUG=${DEBUG:-"true"}
build_cmd="docker build "

if [ "$DEBUG" != "true" ] ; then
  build_cmd="docker build --no-cache"
fi

GO_VER=${GO_VER:-"11"}

# Build base alpine-node:latest image
$build_cmd \
  --rm \
  -t bc-geth-ipfs-dev-${GO_VER} \
  --file Dockerfile.dev \
  .
