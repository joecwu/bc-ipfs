#!/bin/bash

GO_VER=${GO_VER:-"11"}

# Build base alpine-node:latest image
docker build \
  --rm \
  -t alpine-node \
  --file Dockerfile.alpine-node \
  .
GO_VER=$GO_VER ./build-go-node.sh
