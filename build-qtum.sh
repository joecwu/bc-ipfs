#!/bin/bash -x

DEBUG=${DEBUG:-"true"}
build_cmd="docker build "

if [ "$DEBUG" != "true" ] ; then
  build_cmd="docker build --no-cache"
fi

# Build base qtum image with the correct non-pivileged UID user
$build_cmd \
  --rm \
  -t ipfs-qtum-dev \
  --build-arg QTUM_UID=$(id -u $USER) \
  --file Dockerfile.qtum \
  .

ret=$?
if [ "$ret" -ne "0" ] ; then
  echo  "fail - docker build fail"
  exit $ret
fi

exit 0
