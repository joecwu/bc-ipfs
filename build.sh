#!/bin/bash -x

DEBUG=${DEBUG:-"true"}
build_cmd="docker build "

if [ "$DEBUG" != "true" ] ; then
  build_cmd="docker build --no-cache"
fi

BUILD_BRANCH=${BUILD_BRANCH:-"master"}

# Build base blcksync/alpine-node:latest image
$build_cmd \
  --rm \
  --build-arg BUILD_BRANCH=$BUILD_BRANCH \
  -t bc-ipfs-${BUILD_BRANCH} \
  --file Dockerfile \
  .
