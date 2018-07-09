#!/bin/bash

docker build \
  --rm \
  -t go-node \
  --build-arg ALPINE_IMAGE="mhart/alpine-node:base-10.8" \
  --file Dockerfile.go-node \
  .
