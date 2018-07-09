# bc-ipfs
A generic ipfs client to talk to different blockchain e.g. ethereum, etc. via plugins and modules.
The purpose for this started to simply provide a module to integrate with blockchain for any IPFS
related applications. Block chain is not limited to Ethereum, but also refer to others if applicable
in the sense to integrate with IPFS.

*Require docker engine 1.13+ or docker-ce 17.0+*

# How to Build and Run
To build the docker images locally, run the following 2 in sequence.
```
# Build alpine+nodejs and golang runtime based on alpine+nodejs image
./build-alpine-go-node.sh
# Build dev env with npm packages, ipfs, etc.
./build.sh
```

or if you want to use an existing alpine image e.g. `mhart/alpine-node:base-10.8`
```
# Only build the golang runtime
./build-go-node.sh
# Build dev env with npm packages, ipfs, etc.
./build.sh
```

To run the image `bc-ipfs`, just invoke `run.sh`
```
./run.sh
```
or to kick off the dev image `bc-ipfs-dev`, just invoke `run-dev.sh`.
```
run-dev.sh
```
This kicks off a container that `mount` the directory `bc-ipfs-example`
into the container if you want to dynamically make changes and verify
it from the browser directly without re-building a release image. This
is designed for development and convinience. However, this expose a risk
since you may be installing random libraries and npm modules into the container
and running them. Make sure your container is not being exploited and
ensure you are only running the container as a non-privilege user.
e.g. `USER $IPFS_UID` when you launch the container. This is the default
user created along with the image.

Within the container, invoke the following command:
* `npm` installation
```
cd bc-ipfs-example
npm install
```
* `ipfs` init and start
```
ipfs init
ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/8080
ipfs config Addresses.API /ip4/0.0.0.0/tcp/5001
# See https://github.com/ipfs/js-ipfs-api#cors for more refining policies on
# acceptable URLs (CORS = Cross Origin Resource Sharing)
# The following policy creates SECURITY BREACH!!!!!!!!!!
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
ipfs daemon &
```
* `npm` start to kick off webpack and react, etc. and open your browser to access
`localhost:3000`.
```
npm start
```

# Just looking for an IPFS image to run IPFS?

Kick off the following script, an image `go-ipfs-insecure` will be provided.
```
./build-insecure-ipfs.sh
```

It simply applies the *insecure* config by default to accept ALL incoming http request
in the startup script for ipfs.
```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
```

See: https://github.com/INFURA/tutorials/wiki/IPFS-and-CORS for an example
on `API.HTTPHeaders.Access-Control-Allow-Origin` and read https://github.com/ipfs/js-ipfs-api#cors
for more detail info on `CORS`.

See https://github.com/ipfs/go-ipfs for more details on how to run this container. A
quick example here show syou how to kick it off.

`/data/ipfs` and `/export` are inside the container and no data will be preserved
when the container is terminated.
```
docker run  \
  --rm \
  -d --name insecure-ipfs-test \
  -p 4001:4001 \
  -p 127.0.0.1:8080:8080 \
  -p 127.0.0.1:5001:5001 \
  go-ipfs-insecure
```

The following grant access via `docker volume` to your local host filesystem to preserve
`/data/ipfs` and `/export`.
```
export ipfs_staging=</absolute/path/to/somewhere/>
# To preserve ipfs data on your localhost
export ipfs_data=</absolute/path/to/somewhere_else/>
# This run as user root, be careful. port 4001 is bind to ALL interfaces
docker run \
  --rm \
  -d --name insecure-ipfs-test \
  -v $ipfs_staging:/export \
  -v $ipfs_data:/data/ipfs \
  -p 4001:4001 \
  -p 127.0.0.1:8080:8080 \
  -p 127.0.0.1:5001:5001 \
  go-ipfs-insecure
```
