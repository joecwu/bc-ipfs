# bc-ipfs
A generic ipfs client to talk to different blockchain e.g. ethereum, etc. via plugins and modules.
The purpose for this started to simply provide a module to integrate with blockchain for any IPFS
related applications. Block chain is not limited to Ethereum, but also refer to others if applicable
in the sense to integrate with IPFS.

If you are using Docker: *Require docker engine 1.13+ or docker-ce 17.0+*
If you are running locally on your laptop: Require *nodejs 8.14.0+* and *npm 6.4.0+*
```
# npm -v
6.4.1
# node -v
v8.14.0
```

The following branches are locked for several purposes. This current `master` branch is the development branch
and the current stable one is `encryption-v0.5.9`. All development should be based on `master` and refer to
`encryption-v0.5.9` for now.

* `master` - new for development including new features, etc.
* `encryption-v0.5.9` - stable, tracks all history, bug fix
* `encryption-v0.4` - stable, tracks all history
* `encryption-v0.3` - stable, and backport features and PR from master if necessary
* `encryption-v0.2` - old, stable, only for old version and compatibility test.
* `encryption-v0.1` - old, don't use, just for reference.

# How to Build and Run

## Local Unix/Laptop

* Mac

```
# Install nodejs and npm
brew install node
# You can also download it from https://nodejs.org/en/
# Run this project
git clone -b master https://github.com/blcksync/bc-ipfs.git bc-ipfs
cd bc-ipfs
cd bc-ipfs
# Delete and re-install all modules, cleanup
rm -rf node_modules
npm install
npm test
```

* Ubuntu 16.04+

```
# Install nodejs and npm
sudo su - curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo su - apt-get install -y nodejs
# Run this project
git clone -b master https://github.com/blcksync/bc-ipfs.git bc-ipfs
cd bc-ipfs
cd bc-ipfs
# Delete and re-install all modules, cleanup
rm -rf node_modules
npm install
npm test
```

## Docker

To build the docker images locally, run the following 2 in sequence.
```
# Build alpine+nodejs and golang runtime based on alpine+nodejs image
# To build go-lang 1.11.x (default we try to use the latest) with npm and nodejs
# This produce an image with tag 'blcksync/alpine-node:latest' along with a
# go-lang 1.11.x image including npm
GO_VER=11 ./build-alpine-go-node.sh
# Build dev env with npm packages, ipfs, etc. and run it with run-dev.sh
./build-dev.sh
# Build a ready to run image without development libs and tools and run it
# with run-prod.sh or run-test.sh
./build.sh
```

or if you want to use an existing alpine image e.g. `mhart/alpine-node:base-10.8`
```
# Only build the golang runtime
# To build go-lang 1.11.x (default we try to use the latest)
GO_VER=11 ALPINE_IMAGE="mhart/alpine-node:base-10.8" ./build-go-node.sh
# GO_VER=10 if you need go-lang 1.10.x
# Build dev env with npm packages, ipfs, etc.
./build.sh
```

To run the image `blcksync/bc-ipfs:<BRANCHNAME>`, just invoke `BUILD_BRANCH=<BRANCHNAME> run.sh`
e.g.
```
# <BRANCHNAME> is the tag/branch name, this example will try to run the docker
# image blcksync/bc-ipfs:encryption-v0.5.9
BRANCHNAME=encryption-v0.5.9 ./run.sh
```
or to kick off the local dev image `bc-geth-ipfs-dev-11`, just invoke `run-dev.sh`.
```
# Build the dev image first. The dev image does not care about the current
# bc-ipfs source code and branch. It is agnostic and only provides a run-time
# environment for bc-ipfs code.
./build-dev.sh
# Run the dev image bc-geth-ipfs-dev in container. This mounts the bc-ipfs
# directory from the host into the container.
./run-dev.sh
# you can then do 'cd bc-ipfs' and 'npm test'/'npm start' to start testing
```
This kicks off a container that `mount` the directory `bc-ipfs`
into the container if you want to dynamically make changes and verify
it from the browser directly without re-building a release image every time.
This is designed for development and convenience. However, this exposes a risk
since you may be installing random libraries and npm modules into the container
and running them which will go back to your host's `node_modules` directory.
Make sure your container is not being exploited and ensure you are only running
the container as a non-privilege user.
e.g. `USER $IPFS_UID` when you launch the container. This is the default
user created along with the image.

Within the development container `bc-geth-ipfs-dev-11`, invoke the following command:

* `npm` installation
```
cd bc-ipfs
env NODE_ENV=development npm install
```

* Manual `ipfs` init and start has been **OBSOLETE**. We discourage running a local
IPFS instance inside the same container of `bc-ipfs`.
We have moved the IPFS node to its own docker container `blcksync/bc-ipfs:TAGs`.
You can find them [here](https://hub.docker.com/r/blcksync/bc-ipfs-node).
For those who still wants to run a local IPFS node, you can still run it, however,
the ports are no longer exposed and you will need to manually expose them at runtime.
e.g. `docker run --publish 5001:5001 --publish 8080:8080`.
See below section for more info.

* `npm` start to kick off webpack and react, etc. and open your browser to access
`localhost:3000`.
```
npm test
```

# Just looking for an IPFS image to run IPFS?

Kick off the following script, an image `go-ipfs-insecure` will be provided.
We use the community images from https://hub.docker.com/r/ipfs/go-ipfs/ and provide
a simple script to kick it off for you.
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
on `API.HTTPHeaders.Access-Control-Allow-Origin` and read https://github.com/ipfs/js-ipfs-http-client#cors
for more detail info on `CORS`.

See https://github.com/ipfs/go-ipfs for more details on how to run this container. A
quick example here show syou how to kick it off.

`/data/ipfs` and `/export` are inside the container and no data will be preserved
when the container is terminated.
```
docker run  \
  --rm \
  -d --name go-ipfs-insecure-ipfs-test \
  -p 4001:4001 \
  -p 8080:8080 \
  -p 5001:5001 \
  blcksync/go-ipfs-insecure
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
  -d --name go-ipfs-insecure-ipfs-test \
  -v $ipfs_staging:/export \
  -v $ipfs_data:/data/ipfs \
  -p 4001:4001 \
  -p 8080:8080 \
  -p 5001:5001 \
  go-ipfs-insecure
```

To stop the container, simply use the following command:
```
docker stop $(docker ps -f "NAME=go-ipfs-insecure-ipfs-test" --format "{{.ID}}")
```

# Setup development environment and standard
**This is still work in progress, we are migrating to eslint**
Please see branch: `eslint` for this work.
The tools we use here is `babel-eslint`, `prettier-eslint`, `eslint-config-airbnb`,
and plugins `react`, `jsx-a11y`, and `import` with VSCode.
```
npm install prettier-eslint --save-dev
npm install babel-eslint --save-dev
npm install eslint-plugin-babel --save-dev
npm install eslint-plugin-prettier --save-dev
npm install eslint-plugin-react  --save-dev
npm install eslint-plugin-jsx-a11y --save-dev
npm install eslint-plugin-import --save-dev
npm install eslint-plugin-jest --save-dev
npm install eslint-config-jest-enzyme --save-dev
npm install eslint-config-airbnb --save-dev
```

**Known Issues on npm install**
If you are still missing some dependencies from `npm install`, the following is an exhausted list
to capture all required npm modules. Please report any other missing ones if you notice them.

**Required**
```
npm install -S react@16.6.3 \
  @types/react@16.7.3 \
  react-router-dom@4.3.1 \
  crypto-js@3.1.9-1 \
  ethereumjs-tx@1.3.7 \
  ipfs-http-client@28.1.0 \
  jquery@3.3.1 \
  js-sha256@0.9.0 \
  react-bootstrap@0.32.4 \
  react-dom@16.6.3 \
  react-confirm-alert@2.0.7 \
  react-hotjar@1.0.11 \
  url-parse@1.4.4 \
  web3@1.0.0-beta.36 \
  whatwg-fetch@3.0.0 \
  config-webpack@1.0.4 \
  config@1.30.0 \
  bignumber.js@8.0.1 \
  bootstrap@3.3.7
```

**Development Only**
```
npm install -S @types/react-dom@16.0.9 \
    babel-core@6.26.3 \
    babel-loader@7.1.5 \
    babel-preset-env@1.7.0 \
    babel-preset-react@6.24.1 \
    css-loader@1.0.1 \
    file-loader@1.1.11 \
    html-loader@0.5.5 \
    html-webpack-plugin@3.2.0 \
    style-loader@0.21.0 \
    webpack@4.28.2 \
    webpack-cli@3.1.2 \
    webpack-dev-server@3.1.10 \
    webpack-merge@4.1.5
```
## Appendix

### Command
Running with specific environment in development or production mode.

**Development** - `NODE_ENV` preset to `NODE_ENV=development`
```
npm test
```

**Production** - `NODE_ENV` preset to `NODE_ENV=production`
```
npm start
```

### Docker
Running with specific environment in development or production mode.

**Development**
```
./run-test.sh
```

**Production**
```
./run-prod.sh
```

**Specific Image**
This kicks off the publically avaialable (TBD) **blcksync/bc-ipfs**:`tag` image on
[dockerhub](https://hub.docker.com/). e.g. `master` branch. To run a different branch,
use the `tag` as the branch name. Currently, we only release tags with branch name
`master` or `encryption-vX.Y.Z` where `vX.Y.Z` is the `git tag` in this github repo.
```
docker run --rm -it \
  --publish 3000:3000 \
  --publish 5001:5001 \
  --publish 8888:8080 \
  --env IPFS_PATH=/data/ipfs \
  blcksync/bc-ipfs:master \
  npm test
```
Change command `npm test` to `npm start` for production.
