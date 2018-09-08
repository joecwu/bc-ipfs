#!/bin/bash

set -a
source /etc/profile.d/go_path.sh

ipfs init
ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
# See https://github.com/ipfs/js-ipfs-api#cors for more refining policies on
# acceptable URLs (CORS = Cross Origin Resource Sharing)
# The following policy creates SECURITY BREACH!!!!!!!!!!
# TODO: Fix this
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
ipfs daemon &

set +a

cd $HOME
npm start
