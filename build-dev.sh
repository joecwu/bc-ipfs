#!/bin/bash -x

DEBUG=${DEBUG:-"true"}
build_cmd="docker build "

if [ "$DEBUG" != "true" ] ; then
  build_cmd="docker build --no-cache"
fi

# Build base alpine-node:latest image
$build_cmd \
  --rm \
  -t bc-geth-ipfs-dev \
  --file Dockerfile.dev \
  .
