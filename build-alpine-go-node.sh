#!/bin/bash

# Build base alpine-node:latest image
docker build \
  --rm \
  -t alpine-node \
  --file Dockerfile.alpine-node \
  .

docker build \
  --rm \
  -t go-node \
  --file Dockerfile.go-node \
  .
